#include <stdio.h>

#include "http.h"
#include "main.h"
#include "infrared.h"
#include "wifi_lib.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "freertos/semphr.h"

SemaphoreHandle_t mutex = ((void*)(1));
Votacao votos = { .id = 0, .voto_1 = 0, .voto_2 = 0};

void app_main(void)
{

    //Initialize NVS
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES) {
      ESP_ERROR_CHECK(nvs_flash_erase());
      ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);
    ESP_ERROR_CHECK(esp_netif_init());

    configure_infrared_io();
    init_wifi();
    init_http();
}
