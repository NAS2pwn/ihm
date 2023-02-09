//
//  index.js
//  formulaire version 1.0
//  Created by Ingenuity i/o on 2023/02/08
//
//  no description
//  Copyright © 2023 Ingenuity i/o. All rights reserved.
//

//server connection
function isConnectedToServerChanged(isConnected)
{
    if (isConnected)
        document.getElementById("connectedToServer").style.background = 'green';
    else
        document.getElementById("connectedToServer").style.background = 'red';
}

var service_called = false

//inputs
function clearanceInputCallback(type, name, valueType, value, myData) {
    console.log(name + " changed to " + value);
    //add code here if needed

    if(service_called) {
        var phrase = "Patient n°" + document.getElementById("patient_input").value
                     + " has a clearance of " + value + " according to the "
                     + document.getElementById("methode_input").value + " method"

        document.getElementById("results").innerHTML = phrase;

        IGS.outputSetString("formatted_clearance", phrase);
        service_called = false
    }
}

var classError = "input-error"

function update_classError(isOk, inputElement) {
    if(isOk)
        inputElement.classList.remove(classError)
    else
        inputElement.classList.add(classError)
}

function manage_inputs() {
    poids_html = document.getElementById("weight_input")
    sexe_html = document.getElementById("gender_input")
    age_html = document.getElementById("age_input")
    creatinine_html = document.getElementById("creatinine_input")
    methode_html = document.getElementById("methode_input")
    patient_html = document.getElementById("patient_input")

    poids = poids_html.value
    sexe = sexe_html.value
    age = age_html.value
    creatinine = creatinine_html.value
    methode = methode_html.value
    patient = patient_html.value

    poids_ok = (Number(poids) == poids && poids > 0.0)
    update_classError(poids_ok, poids_html)

    sexe_ok = (sexe == "male" || sexe == "female")
    update_classError(sexe_ok, sexe_html)

    age_ok = (Number(age) == age && age > 0)
    update_classError(age_ok, age_html)

    creatinine_ok = (Number(creatinine) && creatinine > 0.0)
    update_classError(creatinine_ok, creatinine_html)

    methode_ok = (methode == "cockcroft-gault" || methode == "mdrd")
    update_classError(methode_ok, methode_html)

    patient_ok = (Number(patient) == patient && patient > 0)
    update_classError(patient_ok, patient_html)

    return {
        ok : (poids_ok && sexe_ok && age_ok && creatinine_ok && methode_ok),
        poids : Number(poids),
        sexe : sexe,
        age : Number(age),
        creatinine : Number(creatinine),
        methode : methode,
        patient : Number(patient),
    }
}

function calculate_clearance() {
    inputs = manage_inputs()

    if(inputs.ok) {
        service_called = true
        var arguments = new Array()
        IGS.serviceArgsAddDouble(arguments, inputs.poids)
        IGS.serviceArgsAddString(arguments, inputs.sexe)
        IGS.serviceArgsAddInt(arguments, inputs.age)
        IGS.serviceArgsAddDouble(arguments, inputs.creatinine)
        IGS.serviceArgsAddString(arguments, inputs.methode)
        IGS.serviceCall ("laboratoire", "calculate_clearance", arguments, "moioe");
    }
}

IGS.netSetServerURL("ws://localhost:22222");
IGS.agentSetName("formulaire");
IGS.observeWebSocketState(isConnectedToServerChanged);

IGS.definitionSetVersion("1.0");

IGS.inputCreate("clearance", iopTypes.IGS_DOUBLE_T, 0);

IGS.outputCreate("formatted_clearance", iopTypes.IGS_STRING_T, "");


//Initialize agent
IGS.observeInput("clearance", clearanceInputCallback);

//actually start ingescape
IGS.start();


//
// HTML example
//

document.getElementById("serverURL").value = IGS.netServerURL();

//update websocket config
function setServerURL() {
    IGS.netSetServerURL(document.getElementById("serverURL").value);
}

