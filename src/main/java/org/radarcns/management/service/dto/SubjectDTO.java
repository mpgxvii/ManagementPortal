package org.radarcns.management.service.dto;


import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import javax.validation.constraints.Size;

/**
 * A DTO for the Subject entity.
 */
public class SubjectDTO implements Serializable {

    public static final String HUMAN_READABLE_IDENTIFIER_KEY = "Human-readable-identifier";

    private Long id;

    private String login;

    @Size(min = 5, max = 100)
    private String email;

    private String externalLink;

    private String externalId;

    private Boolean removed =false ;

    private boolean activated = false;

    private String createdBy;

    private ZonedDateTime createdDate;

    private String lastModifiedBy;

    private ZonedDateTime lastModifiedDate;

    private ProjectDTO project;

    private Set<MinimalSourceDetailsDTO> sources = new HashSet<>();

    private Set<AttributeMapDTO> attributes = new HashSet<>();

    public boolean isActivated() {
        return activated;
    }

    public void setActivated(boolean activated) {
        this.activated = activated;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public ProjectDTO getProject() {
        return project;
    }

    public void setProject(ProjectDTO project) {
        this.project = project;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public ZonedDateTime getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(ZonedDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public String getExternalLink() {
        return externalLink;
    }

    public void setExternalLink(String externalLink) {
        this.externalLink = externalLink;
    }
    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }
    public Boolean getRemoved() {
        return removed;
    }

    public void setRemoved(Boolean removed) {
        this.removed = removed;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public Set<MinimalSourceDetailsDTO> getSources() {
        return sources;
    }

    public void setSources(Set<MinimalSourceDetailsDTO> sources) {
        this.sources = sources;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Set<AttributeMapDTO> getAttributes() {
        return attributes;
    }

    public void setAttributes(Set<AttributeMapDTO> attributes) {
        this.attributes = attributes;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        SubjectDTO subjectDTO = (SubjectDTO) o;

        if ( ! Objects.equals(id, subjectDTO.id)) { return false; }

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "SubjectDTO{" +
            "id=" + id +
            ", externalLink='" + externalLink + "'" +
            ", enternalId='" + externalId + "'" +
            ", removed='" + removed + "'" +
            '}';
    }
}
