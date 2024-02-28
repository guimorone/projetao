#include "infrared.h"
#include "esp_err.h"
#include "driver/gpio.h"
#include "time.h"


#define GPIO_INPUT_PIN_SEL  ((1ULL<<INF_GPIO_1) | (1ULL<<INF_GPIO_2) | (1ULL<<INF_GPIO_3))
#define ESP_INTR_FLAG_DEFAULT 0
#define TIMEOUT 1

static QueueHandle_t gpio_evt_queue = NULL;

extern SemaphoreHandle_t mutex;
extern Votacao votos;

static void IRAM_ATTR gpio_isr_handler(void* arg)
{
    uint32_t gpio_num = (uint32_t) arg;
    xQueueSendFromISR(gpio_evt_queue, &gpio_num, NULL);
}


static void infrared_task(void* arg)
{
    uint32_t io_num;
    uint8_t lvl = NOT_DETECTED;
    time_t t_voto_1, t_voto_2; 
    time(&t_voto_1);
    time(&t_voto_2);
    while(1){
        if(xQueueReceive(gpio_evt_queue, &io_num, pdMS_TO_TICKS(100))) {
            xQueueReset(gpio_evt_queue);

            lvl = gpio_get_level(io_num);
            printf("GPIO[%ld] intr, val: %d\n", io_num, lvl);
            time_t curr_time;
            time(&curr_time);
            printf("Time diff: %lld\n", curr_time-t_voto_1);
            if (io_num > 21 && curr_time-t_voto_1 >= TIMEOUT){
                votos.voto_1 += 1;
                time(&t_voto_1);
                printf("ADICIONEI NA VOTACAO 1, TOTAL: %ld\n\n", votos.voto_1);
            }
            else if(time(NULL)-t_voto_2 >= TIMEOUT){
                votos.voto_2 += 1;
                time(&t_voto_2);
                printf("ADICIONEI NA VOTACAO 1, TOTAL: %ld\n\n", votos.voto_2);
            }
            printf("Total 1: %ld, 2: %ld\n", votos.voto_1, votos.voto_2);
        }
        vTaskDelay(pdMS_TO_TICKS(100));
    }
    vTaskDelete(NULL);
}


void configure_infrared_io(){


    gpio_config_t io_conf = {};

    //interrupt of rising edge
    io_conf.intr_type = GPIO_INTR_ANYEDGE;
    io_conf.pin_bit_mask = GPIO_INPUT_PIN_SEL;
    io_conf.mode = GPIO_MODE_INPUT;
    io_conf.pull_up_en = 0;
    io_conf.pull_down_en = 0;
    gpio_config(&io_conf);

    gpio_set_pull_mode(INF_GPIO_1, GPIO_FLOATING);
    gpio_set_pull_mode(INF_GPIO_2, GPIO_FLOATING);
    gpio_set_pull_mode(INF_GPIO_3, GPIO_FLOATING);

    //create a queue to handle gpio event from isr
    gpio_evt_queue = xQueueCreate(10, sizeof(uint32_t));
    //start gpio task
    xTaskCreate(infrared_task, "infrared_task", 2048, NULL, 10, NULL);

    //install gpio isr service
    gpio_install_isr_service(ESP_INTR_FLAG_DEFAULT);
    //hook isr handler for specific gpio pin
    gpio_isr_handler_add(INF_GPIO_1, gpio_isr_handler, (void*) INF_GPIO_1);
    gpio_isr_handler_add(INF_GPIO_2, gpio_isr_handler, (void*) INF_GPIO_2);
    gpio_isr_handler_add(INF_GPIO_3, gpio_isr_handler, (void*) INF_GPIO_3);
}