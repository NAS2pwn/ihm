#!/usr/bin/env -P /usr/bin:/usr/local/bin python3 -B
# coding: utf-8

#
#  main.py
#  laboratoire version 1.0
#  Created by Ingenuity i/o on 2023/02/08
#

import sys
import ingescape as igs

def service_callback(sender_agent_name, sender_agent_uuid, service_name, tuple_args, token, my_data):
    agent_object = my_data

    poids = tuple_args[0]
    
    sexe = tuple_args[1]
    age = tuple_args[2]
    creatinine = tuple_args[3]
    methode = tuple_args[4]

    if methode == "cockcroft-gault" :
        if sexe == "male":
            coeff = 1.23
        else :
            coeff = 1.04

        clearance = coeff * poids * ((140 - age)/creatinine)
    else :
        if sexe == "female" :
            coeff = 0.742
        else :
            coeff = 1
        
        clearance = 186 * pow((creatinine/88.4), -1.154) * pow(age, -0.203) * coeff
    print(clearance)
    igs.output_set_double("clearance", clearance)

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("usage: python3 main.py agent_name network_device port")
        devices = igs.net_devices_list()
        print("Please restart with one of these devices as network_device argument:")
        for device in devices:
            print(f" {device}")
        exit(0)

    igs.agent_set_name(sys.argv[1])
    igs.definition_set_version("1.0")
    igs.log_set_console(True)
    igs.log_set_file(True, None)
    igs.set_command_line(sys.executable + " " + " ".join(sys.argv))

    igs.output_create("clearance", igs.DOUBLE_T, None)

    igs.service_init("calculate_clearance", service_callback, None)
    igs.service_arg_add("calculate_clearance", "poids", igs.DOUBLE_T)
    igs.service_arg_add("calculate_clearance", "sexe", igs.STRING_T)
    igs.service_arg_add("calculate_clearance", "âge", igs.INTEGER_T)
    igs.service_arg_add("calculate_clearance", "créatinine", igs.DOUBLE_T)
    igs.service_arg_add("calculate_clearance", "méthode", igs.STRING_T)

    igs.start_with_device(sys.argv[2], int(sys.argv[3]))

    input()

    igs.stop()

