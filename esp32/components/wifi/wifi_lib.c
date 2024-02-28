/* Simple WiFi Example

   This example code is in the Public Domain (or CC0 licensed, at your option.)

   Unless required by applicable law or agreed to in writing, this
   software is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
   CONDITIONS OF ANY KIND, either express or implied.
*/
#include "wifi_lib.h"
#include "esp_netif.h"

#include "esp_sntp.h"
#include "esp_log.h"


#define DEFAULT_SCAN_LIST_SIZE 10

#define EXAMPLE_ESP_MAXIMUM_RETRY  10
#define EXAMPLE_MAX_STA_CONN       4

/* FreeRTOS event group to signal when we are connected*/
static EventGroupHandle_t s_wifi_event_group;

/* The event group allows multiple bits for each event, but we only care about two events:
 * - we are connected to the AP with an IP
 * - we failed to connect after the maximum amount of retries */
#define WIFI_CONNECTED_BIT   BIT0
#define WIFI_FAIL_BIT        BIT1
#define WIFI_DISCONECTED_BIT BIT2


SemaphoreHandle_t wifi_mutex;
char wifi_ready;
char *wifiIP;

static int s_retry_num = 0;

#define MAX_AP_N    10

TaskHandle_t handleWifi;
TaskHandle_t handleSNTP;

wifi_config_t wifi_configs[MAX_AP_N] = {
        {
            .sta = {
                .ssid = {"Karen"},
                .password = {"z3klrlip"}
            }
        }
};

static void event_handler(void* arg, esp_event_base_t event_base,
                                int32_t event_id, void* event_data)
{
    if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_START) {
        esp_err_t err = esp_wifi_connect();
        ESP_LOGI("WIFI", "esp_wifi_connect log: %s\n", esp_err_to_name(err));
    } else if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_DISCONNECTED) {
        if (s_retry_num < EXAMPLE_ESP_MAXIMUM_RETRY) {
            esp_wifi_connect();
            s_retry_num++;
            ESP_LOGI("WIFI", "retry to connect to the AP");
        } else {
            xEventGroupSetBits(s_wifi_event_group, WIFI_FAIL_BIT);
        }
        ESP_LOGW("WIFI","connect to the AP fail");
    } else if (event_base == IP_EVENT && event_id == IP_EVENT_STA_GOT_IP) {
        ip_event_got_ip_t* event = (ip_event_got_ip_t*) event_data;

        //wifiIP = IP2STR(&event->ip_info.ip);
        wifiIP = strdup(ip4addr_ntoa((ip4_addr_t *)&event->ip_info.ip));
        ESP_LOGI("WIFI", "got ip: %s", wifiIP);
        s_retry_num = 0;
        set_wifi_status(1);
        xEventGroupSetBits(s_wifi_event_group, WIFI_CONNECTED_BIT);
    }
}

static void event_handler_disconect(void* arg, esp_event_base_t event_base,
                                int32_t event_id, void* event_data)
{
    if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_DISCONNECTED) {
        if(s_retry_num == 0){
            xEventGroupSetBits(s_wifi_event_group, WIFI_DISCONECTED_BIT);
            s_retry_num++;
        }
        else if (s_retry_num < EXAMPLE_ESP_MAXIMUM_RETRY) {
            esp_wifi_connect();
            s_retry_num++;
            ESP_LOGI("WIFI", "retry to connect to the AP");
        } else {
            xEventGroupSetBits(s_wifi_event_group, WIFI_FAIL_BIT);
        }
        ESP_LOGI("WIFI","connect to the AP fail");
    } else if (event_base == IP_EVENT && event_id == IP_EVENT_STA_GOT_IP) {
        ip_event_got_ip_t* event = (ip_event_got_ip_t*) event_data;

        //wifiIP = IP2STR(&event->ip_info.ip);
        wifiIP = strdup(ip4addr_ntoa((ip4_addr_t *)&event->ip_info.ip));
        ESP_LOGI("WIFI", "got ip: %s", wifiIP);
        s_retry_num = 0;
        set_wifi_status(1);
        xEventGroupSetBits(s_wifi_event_group, WIFI_CONNECTED_BIT);
    }
}

void set_wifi_status(uint8_t status){
    if(xSemaphoreTake(wifi_mutex, portMAX_DELAY) == pdTRUE){
        wifi_ready = status;
        xSemaphoreGive(wifi_mutex);
    }
}

uint8_t get_wifi_status(){
    uint8_t aux = 0;
    if(xSemaphoreTake(wifi_mutex, portMAX_DELAY) == pdTRUE){
        aux = wifi_ready;
        xSemaphoreGive(wifi_mutex);
    }
    return aux;
}

wifi_config_t scan(void){
    uint16_t number = DEFAULT_SCAN_LIST_SIZE;
    wifi_ap_record_t ap_info[DEFAULT_SCAN_LIST_SIZE];
    uint16_t ap_count = 0;
    memset(ap_info, 0, sizeof(ap_info));

    wifi_config_t wifi_config = {
        .sta = {
            .ssid = {'1'},
            .password = {'1'} 
        },
    };

    int max = -1000;
    esp_wifi_scan_start(NULL, true);
   
    ESP_ERROR_CHECK(esp_wifi_scan_get_ap_records(&number, ap_info));
    ESP_ERROR_CHECK(esp_wifi_scan_get_ap_num(&ap_count));
#ifdef WIFI_DEBUG 
    ESP_LOGI("WIFI", "Total APs scanned = %u", ap_count);
#endif
    for (int i = 0; (i < DEFAULT_SCAN_LIST_SIZE) && (i < ap_count); i++) {
#ifdef WIFI_DEBUG 
        ESP_LOGI("WIFI", "SSID \t\t%s", ap_info[i].ssid);
        ESP_LOGI("WIFI", "RSSI \t\t%d", ap_info[i].rssi);
        ESP_LOGI("WIFI", "Channel \t\t%d\n", ap_info[i].primary);
#endif        
        for(int j=0; j<MAX_AP_N; j++){
            if(!strcmp((char *)wifi_configs[j].sta.ssid, (char *)ap_info[i].ssid)){
                ESP_LOGI("WIFI", "Wifi encontrado: %s\n", wifi_configs[j].sta.ssid);
                if(ap_info[i].rssi != 0 && ap_info[i].rssi > max){
                    memcpy(wifi_config.sta.ssid, wifi_configs[j].sta.ssid, 32);
                    memcpy(wifi_config.sta.password, wifi_configs[j].sta.password, 64);
                    max = ap_info[i].rssi;
                }
            }
        }
    }
    ESP_LOGI("WIFI", "Melhor Sinal: %s\n", wifi_config.sta.ssid);

    return wifi_config;
}

wifi_config_t wifi_init_sta_scan(void)
{

    //ESP_ERROR_CHECK(esp_netif_init());

    ESP_ERROR_CHECK(esp_event_loop_create_default());
    esp_netif_t *esp_netif = esp_netif_create_default_wifi_sta();

    
    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_wifi_init(&cfg));
    
    ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA) );
    ESP_ERROR_CHECK(esp_wifi_start());

    wifi_config_t wifi_config = scan();

    esp_netif_destroy_default_wifi(esp_netif);
    ESP_ERROR_CHECK(esp_wifi_scan_stop());
    ESP_ERROR_CHECK(esp_wifi_stop());
    ESP_ERROR_CHECK(esp_wifi_deinit());

    ESP_ERROR_CHECK(esp_event_loop_delete_default());

    return wifi_config;
}

void wifi_init_sta(wifi_config_t wifi_config)
{
    s_wifi_event_group = xEventGroupCreate();

    ESP_ERROR_CHECK(esp_event_loop_create_default());
    esp_netif_t *esp_netif = esp_netif_create_default_wifi_sta();

    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_wifi_init(&cfg));

    ESP_ERROR_CHECK(esp_event_handler_register(WIFI_EVENT, ESP_EVENT_ANY_ID, &event_handler, NULL));
    ESP_ERROR_CHECK(esp_event_handler_register(IP_EVENT, IP_EVENT_STA_GOT_IP, &event_handler, NULL));

    ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA) );
    ESP_ERROR_CHECK(esp_wifi_set_config(ESP_IF_WIFI_STA, &wifi_config) );
    //ESP_ERROR_CHECK(esp_wifi_set_ps(WIFI_PS_NONE));
    ESP_ERROR_CHECK(esp_wifi_start() );
    

    ESP_LOGI("WIFI", "SSID: %s\n", wifi_config.sta.ssid);
    ESP_LOGI("WIFI", "PASSWORD: %s\n", wifi_config.sta.password);
    ESP_LOGI("WIFI", "wifi_init_sta finished.\n");

    /* Waiting until either the connection is established (WIFI_CONNECTED_BIT) or connection failed for the maximum
     * number of re-tries (WIFI_FAIL_BIT). The bits are set by event_handler() (see above) */
    EventBits_t bits = xEventGroupWaitBits(s_wifi_event_group,
            WIFI_CONNECTED_BIT | WIFI_FAIL_BIT,
            pdFALSE,
            pdFALSE,
            portMAX_DELAY);

    int flag = 0;
    /* xEventGroupWaitBits() returns the bits before the call returned, hence we can test which event actually
     * happened. */
    if (bits & WIFI_CONNECTED_BIT) {
        flag = 1;
        ESP_LOGI("WIFI", "connected to ap SSID:%s password:%s",
                 wifi_config.sta.ssid, wifi_config.sta.password);
    } else if (bits & WIFI_FAIL_BIT) {
        ESP_LOGI("WIFI", "Failed to connect to SSID:%s, password:%s",
                 wifi_config.sta.ssid, wifi_config.sta.password);
    } else {
        ESP_LOGW("WIFI", "UNEXPECTED EVENT");
    }

    ESP_ERROR_CHECK(esp_event_handler_unregister(IP_EVENT, IP_EVENT_STA_GOT_IP, &event_handler));
    ESP_ERROR_CHECK(esp_event_handler_unregister(WIFI_EVENT, ESP_EVENT_ANY_ID, &event_handler));

    xEventGroupClearBits(s_wifi_event_group, WIFI_CONNECTED_BIT | WIFI_FAIL_BIT);
    s_retry_num = 0;
    ESP_ERROR_CHECK(esp_event_handler_register(WIFI_EVENT, ESP_EVENT_ANY_ID, &event_handler_disconect, NULL));
    ESP_ERROR_CHECK(esp_event_handler_register(IP_EVENT, IP_EVENT_STA_GOT_IP, &event_handler_disconect, NULL));
    
    while(flag){
        bits = xEventGroupWaitBits(s_wifi_event_group,
            WIFI_CONNECTED_BIT | WIFI_FAIL_BIT | WIFI_DISCONECTED_BIT,
            pdFALSE,
            pdFALSE,
            portMAX_DELAY);

        if(bits & WIFI_DISCONECTED_BIT){
            vTaskDelay(pdMS_TO_TICKS(500));
            wifi_config = scan();
            ESP_ERROR_CHECK(esp_wifi_set_config(ESP_IF_WIFI_STA, &wifi_config));
            esp_wifi_connect();
            xEventGroupClearBits(s_wifi_event_group, WIFI_DISCONECTED_BIT);
        }
        else if(bits & WIFI_CONNECTED_BIT){
            s_retry_num = 0;
            xEventGroupClearBits(s_wifi_event_group, WIFI_CONNECTED_BIT | WIFI_FAIL_BIT);
            ESP_LOGI("WIFI", "Reconnected to ap SSID:%s password:%s",
                 wifi_config.sta.ssid, wifi_config.sta.password);
        }
        else if (bits & WIFI_FAIL_BIT) {
            ESP_LOGI("WIFI", "Disconected from SSID:%s, password:%s",
            wifi_config.sta.ssid, wifi_config.sta.password);
            set_wifi_status(0);
            flag = 0;
        } else {
            ESP_LOGW("WIFI", "UNEXPECTED EVENT");
            flag = 0;
        }
        vTaskDelay(pdMS_TO_TICKS(500));
    }

    ESP_ERROR_CHECK(esp_event_handler_unregister(IP_EVENT, IP_EVENT_STA_GOT_IP, &event_handler_disconect));
    ESP_ERROR_CHECK(esp_event_handler_unregister(WIFI_EVENT, ESP_EVENT_ANY_ID, &event_handler_disconect));

    vEventGroupDelete(s_wifi_event_group);
    
    esp_netif_destroy_default_wifi(esp_netif);
    ESP_ERROR_CHECK(esp_wifi_stop());
    ESP_ERROR_CHECK(esp_wifi_deinit());

    ESP_ERROR_CHECK(esp_event_loop_delete_default());
}

time_t now;
struct tm timeinfo;
char strftime_buf[64];
bool timeSync = false;

void time_sync_notification_cb(struct timeval *tv)
{
    ESP_LOGI("WIFI", "Notification of a time synchronization event");
}

void initialize_sntp(void)
{
    ESP_LOGI("WIFI", "Initializing SNTP");
    esp_sntp_setoperatingmode(SNTP_OPMODE_POLL);

    esp_sntp_setservername(0, "200.160.7.186");
    sntp_set_time_sync_notification_cb(time_sync_notification_cb);

#ifdef CONFIG_SNTP_TIME_SYNC_METHOD_SMOOTH
    sntp_set_sync_mode(SNTP_SYNC_MODE_SMOOTH);
#endif
    
    esp_sntp_init();
}

void obtain_time(void)
{
    initialize_sntp();

    int retry = 0;
    const int retry_count = 10;
    while (sntp_get_sync_status() == SNTP_SYNC_STATUS_RESET && ++retry < retry_count) {
        ESP_LOGI("WIFI", "Waiting for system time to be set... (%d/%d)", retry, retry_count);
        vTaskDelay(pdMS_TO_TICKS(2000));
    }
}


void initSNTP()
{
    time(&now);
    localtime_r(&now, &timeinfo);
    // Is time set? If not, tm_year will be (1970 - 1900).
    if (timeinfo.tm_year < (2016 - 1900)) {
        ESP_LOGI("WIFI", "Time is not set yet. Connecting to network and getting time over NTP.");
        obtain_time();
        // update 'now' variable with current time
        time(&now);
        timeSync = false;
    }
    localtime_r(&now, &timeinfo);
    strftime(strftime_buf, sizeof(strftime_buf), "%c", &timeinfo);
    ESP_LOGI("WIFI", "BEFORE -The current date/time: %s", strftime_buf);
    // Set timezone to China Standard Time deslocated to Brasilia timezone
    setenv("TZ", "CST+3", 1);
    tzset();
    localtime_r(&now, &timeinfo);
    strftime(strftime_buf, sizeof(strftime_buf), "%c", &timeinfo);
    ESP_LOGI("WIFI", "The current date/time: %s", strftime_buf);
    timeSync = true;
}


static void sntp_task(void *arg){

    while (1)
    {
        if (!timeSync){
            if (get_wifi_status()){
                initSNTP();
            }
        } else
            break;
        vTaskDelay(pdMS_TO_TICKS(1000));
    }
    ESP_LOGI("WIFI", "Deleting SNTP task\n");
    vTaskDelete(NULL);
}


void wifi_task()
{
    while(1){
        wifi_config_t wifi_config = wifi_init_sta_scan();
        wifi_init_sta(wifi_config);
        vTaskDelay(pdMS_TO_TICKS(15000));
    }
    vTaskDelete(NULL);
    
}

void init_wifi(){
    wifi_mutex = xSemaphoreCreateMutex();
    wifi_ready = 0;
    wifiIP = NULL;
    
    xTaskCreate(wifi_task, "init_wifi_task", 4096, NULL, 8, &handleWifi);
    // xTaskCreate(sntp_task, "sntp_task", 2048, NULL, 8, &handleSNTP);
}