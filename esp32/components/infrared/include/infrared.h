#ifndef INFRARED_H
#define INFRARED_H

#include <stdint.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "freertos/semphr.h"
#include "http.h"

#define INF_GPIO_1          23
#define INF_GPIO_2          22
#define DETECTED            0
#define NOT_DETECTED        1

void configure_infrared_io();

#endif
