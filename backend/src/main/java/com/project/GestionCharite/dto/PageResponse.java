package com.project.GestionCharite.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PageResponse<T> {
    private List<T> content;       // The actual data (Users, Actions, etc.)
    private int pageNumber;        // Current page (0-based)
    private int pageSize;          // How many items per page
    private long totalElements;    // Total items in the entire database
    private int totalPages;        // Total number of pages
    private boolean isLast;        // Is this the last page? (Great for React "Next" buttons)
}