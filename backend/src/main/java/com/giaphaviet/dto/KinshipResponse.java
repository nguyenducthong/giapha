package com.giaphaviet.dto;

import com.giaphaviet.model.Person;
import java.util.List;

public class KinshipResponse {
    private Person personA;
    private Person personB;
    private String addressTermAtoB;
    private String addressTermBtoA;
    private int generationDifference;
    private String pathDescription;
    private List<Person> pathPersons;

    public KinshipResponse() {}

    public KinshipResponse(Person personA, Person personB, String addressTermAtoB, String addressTermBtoA, int generationDifference, String pathDescription, List<Person> pathPersons) {
        this.personA = personA;
        this.personB = personB;
        this.addressTermAtoB = addressTermAtoB;
        this.addressTermBtoA = addressTermBtoA;
        this.generationDifference = generationDifference;
        this.pathDescription = pathDescription;
        this.pathPersons = pathPersons;
    }

    public Person getPersonA() { return personA; }
    public Person getPersonB() { return personB; }
    public String getAddressTermAtoB() { return addressTermAtoB; }
    public String getAddressTermBtoA() { return addressTermBtoA; }
    public int getGenerationDifference() { return generationDifference; }
    public String getPathDescription() { return pathDescription; }
    public List<Person> getPathPersons() { return pathPersons; }
}
