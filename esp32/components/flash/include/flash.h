#ifndef FLASH_H_INCLUDED
#define FLASH_H_INCLUDED

#include <stdio.h>
#include <string.h>
#include <stdint.h>
#include <stdlib.h>
#include "esp_system.h"
#include "nvs_flash.h"
#include "nvs.h"
#include "esp_log.h"
#include "http.h"

void initNVM();
esp_err_t read_votes(Votacao *votos);
void save_votes(Votacao votos);

#endif
