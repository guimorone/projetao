#include "flash.h"

// nvs_handle nvhandle;
nvs_handle_t nvhandle;

#define TAG_FLASH "LOG_FLASH"

esp_err_t read_votes(Votacao *votos)
{
    esp_err_t err;

    Votacao out_votes = {.id=0, .voto_1=0, .voto_2= 0};

    size_t required_size = sizeof(Votacao);

    err = nvs_get_blob(nvhandle, "votos", &out_votes, &required_size);
    if (err == ESP_ERR_NVS_NOT_FOUND)
    {
        err = nvs_set_blob(nvhandle, "votos", &out_votes, sizeof(Votacao));
        nvs_commit(nvhandle);
    }

    *votos = out_votes;

    return err;
}

void save_votes(Votacao votos)
{
    ESP_ERROR_CHECK(nvs_set_blob(nvhandle, "votos", &votos, sizeof(Votacao)));
    nvs_commit(nvhandle);
}

void initNVM()
{
    // int i;
    //  Initialize NVS
    //nvs_flash_erase_partition("nvs2");
    esp_err_t err = nvs_flash_init_partition("nvs");

    if (err == ESP_ERR_NVS_NO_FREE_PAGES)
    {
        // NVS partition was truncated and needs to be erased

        // Retry nvs_flash_init
        ESP_LOGI(TAG_FLASH, "Flashing nvs");
        ESP_ERROR_CHECK(nvs_flash_erase());
        err = nvs_flash_init_partition("nvs"); // nvs_flash_init();

        if (err != ESP_OK)
        {
            ESP_LOGE(TAG_FLASH, "Error (%s)!\n", esp_err_to_name(err));
        }
    }

    ESP_ERROR_CHECK(err);

    err = nvs_open_from_partition("nvs", "storage", NVS_READWRITE, &nvhandle);
    if (err != ESP_OK)
    {
        ESP_LOGE(TAG_FLASH, "Error (%s) opening NVS handle!\n", esp_err_to_name(err));
    }

}