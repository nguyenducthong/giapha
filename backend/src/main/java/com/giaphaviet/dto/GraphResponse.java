package com.giaphaviet.dto;

import com.giaphaviet.model.Person;
import com.giaphaviet.model.ParentChildRelationship;

import java.util.List;

public class GraphResponse {
    private List<Person> nodes;
    private List<ParentChildRelationship> edges;
    private long totalMembers;
    private long livingCount;
    private long deceasedCount;

    public GraphResponse() {}

    public GraphResponse(List<Person> nodes, List<ParentChildRelationship> edges, long totalMembers, long livingCount, long deceasedCount) {
        this.nodes = nodes;
        this.edges = edges;
        this.totalMembers = totalMembers;
        this.livingCount = livingCount;
        this.deceasedCount = deceasedCount;
    }

    public List<Person> getNodes() { return nodes; }
    public List<ParentChildRelationship> getEdges() { return edges; }
    public long getTotalMembers() { return totalMembers; }
    public long getLivingCount() { return livingCount; }
    public long getDeceasedCount() { return deceasedCount; }
}
