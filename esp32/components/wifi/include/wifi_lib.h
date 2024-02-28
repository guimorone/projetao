#ifndef WIFI_LIB_H__
#define WIFI_LIB_H__

#include "stdio.h"
#include "stdlib.h"
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/event_groups.h"
#include "freertos/semphr.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include "sdkconfig.h"
#include "lwip/err.h"
#include "lwip/sys.h"
#include <stdarg.h>
#include <sys/time.h>
#include <time.h>
#include <stdint.h>

#include "lwip/sockets.h"
#include "lwip/netif.h"
#include "lwip/dns.h"
#include "esp_sntp.h"
#include "esp_sleep.h"
#include "esp_log.h"
#include "driver/uart.h"
#include "main.h"
#include "esp_system.h"

#include "esp_ota_ops.h"
#include "esp_http_client.h"
#include "esp_https_ota.h"


void set_wifi_status(uint8_t status);
uint8_t get_wifi_status();
void init_wifi();

#endif