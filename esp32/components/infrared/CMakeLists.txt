idf_component_register(SRCS "infrared.c"
                    INCLUDE_DIRS "include"
                    REQUIRES driver
                    REQUIRES freertos
                    REQUIRES http
                    REQUIRES flash)
