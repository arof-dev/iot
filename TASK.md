Протокол MQTT

Задание 1
Требуется управлять влажностью в помещении. В помещении имеется датчик влажности и исполнительное устройство (вытяжка). Используйте протокол MQTT для решения поставленной задачи.
В решении необходимо использовать веб сервер для настройки параметров управления влажностью и ее мониторинга, и сервер использующий эти параметры в для управления вытяжкой через mqtt.

Задание 2: Реализовать задание 1 применительно к освещенности.

Задание 3: Реализовать задание 1 применительно к влажности почвы. Учтите, что для небольших систем задержка между MQTT запросами может быть достаточна для того, чтобы переувлажнить почву. Поэтому увлажнение почвы должно производиться “дозировано”, т.е. после очередной порции воды исполнительное устройство дает ей впитаться, ждет некоторое время позволяя системе прийти в равновесие, после чего всё повторяется.

Задание 4: Разработать систему мониторинга температуры с уведомлениями о достижении некоторых пороговых значений с использованием MQTT. Предполагается, что изменение температуры происходит достаточно медленно.

Решите поставленные задачи используя протокол HTTP вместо MQTT.
Решите поставленные задачи используя собственный протокол для обмена данными.
Своя задача: Придумайте и согласуйте с преподавателем свою задачу. Решите ее.

Для зачета достаточно решить 8 заданий.
