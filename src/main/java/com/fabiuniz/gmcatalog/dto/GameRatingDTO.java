package com.gamecatalog.gmcatalog.dto;

import jakarta.validation.constraints.NotNull;

public class GameRatingDTO {

    @NotNull(message = "Game ID cannot be null")
    private Long gameId;

    @NotNull(message = "Rating cannot be null")
    private Double score;

    // Constructors (optional, but good practice)
    public GameRatingDTO() {
    }

    public GameRatingDTO(Long gameId, Double score) {
        this.gameId = gameId;
        this.score = score;
    }

    // Getters
    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public Double getScore() {
        return score;
    }

    // Corrected Setter Method: Removed the extra 'void'
    public void setScore(Double score) { // <--- Corrected line
        this.score = score;
    }
}