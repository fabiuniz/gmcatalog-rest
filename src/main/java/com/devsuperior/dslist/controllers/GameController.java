package com.gamecatalog.dslist.controllers;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;

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
}