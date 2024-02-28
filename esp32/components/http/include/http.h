#ifndef HTTP_H
#define HTTP_H

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"

typedef struct {
    uint32_t id;
    uint32_t voto_1;
    uint32_t voto_2;
} Votacao;

void init_http();

#endif
