package com.gamecatalog.dslist.controllers;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import com.gamecatalog.dslist.entities.Game;
import com.gamecatalog.dslist.dto.GameRatingDTO;
import com.gamecatalog.dslist.dto.GameDTO;
import com.gamecatalog.dslist.dto.GameMinDTO;
import com.gamecatalog.dslist.services.GameService;

import com.gamecatalog.dslist.dto.GameUpdateDTO; 
@RestController
@RequestMapping(value = "/games")
public class GameController {

	@Autowired
	private GameService gameService;	

	@GetMapping(value = "/{id}")
	public GameDTO findById(@PathVariable Long id) {
		GameDTO result = gameService.findById(id);
		return result;
	}

	@GetMapping
	public List<GameMinDTO> findAll() {
		List<GameMinDTO> result = gameService.findAll();
		return result;
	}
	@PostMapping
	public GameDTO create(@RequestBody GameDTO dto) {
    	GameDTO result = gameService.save(dto);
    	return result;
	}
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        gameService.delete(id);
        return ResponseEntity.noContent().build();
	}
    // Novo endpoint para atualizar um jogo
    @PutMapping(value = "/{id}")
    public GameDTO update(@PathVariable Long id, @RequestBody GameUpdateDTO dto) {
        GameDTO result = gameService.update(id, dto);
        return result;
    }
    @PutMapping("/{gameId}/rating")
	public ResponseEntity<GameDTO> updateRating(@PathVariable Long gameId, @Valid @RequestBody GameRatingDTO gameRatingDTO) {
        // Validate if the ID in the path matches the ID in the DTO
        // This is good for ensuring consistency and preventing misuse
        if (!gameId.equals(gameRatingDTO.getGameId())) {
            // Return 400 Bad Request if IDs don't match
            return ResponseEntity.badRequest().body(null);
        }
		try {
            // Call service method to update the score (which is 'rating' in GameRatingDTO)
            // The service method will now receive the gameId and the rating value
			GameDTO updatedGameDTO = gameService.updateGameRating(gameId, gameRatingDTO.getScore());
			return ResponseEntity.ok(updatedGameDTO); // 200 OK
		} catch (IllegalArgumentException e) {
            // This exception typically indicates "not found" or invalid business logic error
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 404 Not Found
		} catch (Exception e) {
            // Catch any other unexpected errors
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 500 Internal Server Error
		}
	}
}