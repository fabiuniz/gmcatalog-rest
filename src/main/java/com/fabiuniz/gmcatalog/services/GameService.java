package com.fabiuniz.gmcatalog.services;
import org.springframework.beans.BeanUtils;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import com.fabiuniz.gmcatalog.repositories.BelongingRepository;

import org.springframework.data.domain.Sort; // Importe esta classe
import java.util.stream.Collectors; // Adicione esta linha
import com.fabiuniz.gmcatalog.dto.GameRatingDTO;
import com.fabiuniz.gmcatalog.dto.GameDTO;
import com.fabiuniz.gmcatalog.dto.GameMinDTO;
import com.fabiuniz.gmcatalog.dto.GameUpdateDTO;
import com.fabiuniz.gmcatalog.entities.Game;
import com.fabiuniz.gmcatalog.entities.GameList;
import com.fabiuniz.gmcatalog.entities.Belonging;
import com.fabiuniz.gmcatalog.projections.GameMinProjection;
import com.fabiuniz.gmcatalog.repositories.GameRepository;
import com.fabiuniz.gmcatalog.repositories.GameListRepository;
import java.util.Optional;

@Service
public class GameService {

	@Autowired
	private GameRepository gameRepository;

	@Autowired
	private GameListRepository gameListRepository;

	@Autowired
	private BelongingRepository belongingRepository;

	@Transactional(readOnly = true)
	public GameDTO findById(@PathVariable Long listId) {
		Game result = gameRepository.findById(listId).get();
		return new GameDTO(result);
	}
	
	@Transactional(readOnly = true)
	public List<GameMinDTO> findAll() {
		// Altere esta linha para incluir a ordenação
		// Ordena por 'score' em ordem decrescente (do maior score para o menor)
		List<Game> result = gameRepository.findAll(Sort.by("score").descending());
		// Se quiser em ordem crescente (do menor score para o maior), use:
		// List<Game> result = gameRepository.findAll(Sort.by("score").ascending());
		return result.stream().map(GameMinDTO::new).collect(Collectors.toList());
	}
	
	@Transactional(readOnly = true)
	public List<GameMinDTO> findByGameList(Long listId) {
		// Assumindo que GameMinProjection seja o tipo de retorno da sua query nativa
		// que já tem o ORDER BY tb_belonging.position
		List<GameMinProjection> result = gameRepository.searchByList(listId);
		return result.stream().map(GameMinDTO::new).collect(Collectors.toList());
	}
    @Transactional
    public GameDTO save(GameDTO dto) {
        // 1. Criar e salvar a entidade Game
        Game entity = new Game();
        BeanUtils.copyProperties(dto, entity);
        entity = gameRepository.save(entity);

        // 2. Verificar ou criar uma lista de jogos pelo nome
        GameList gameList;
        String listName = dto.getPlatforms(); // Obtém o nome da lista do DTO

        if (listName == null || listName.trim().isEmpty()) {
            // Se nenhum nome de lista for fornecido, usar uma lista padrão
            listName = "Default List"; // Nome da lista padrão
        }

        // Tentar encontrar a lista pelo nome
        Optional<GameList> existingGameList = gameListRepository.findByName(listName); // Você precisará criar este método no GameListRepository

        if (existingGameList.isPresent()) {
            gameList = existingGameList.get();
        } else {
            // Se a lista não existir, criar uma nova
            gameList = new GameList(null, listName);
            gameList = gameListRepository.save(gameList);
        }

        // 3. Determinar a posição do jogo na lista
        List<Belonging> belongings = belongingRepository.findByListId(gameList.getId());
        int nextPosition = belongings.isEmpty() ? 0 : belongings.size();

        // 4. Criar e salvar a associação em tb_belonging
        Belonging belonging = new Belonging();
        belonging.setGame(entity);
        belonging.setList(gameList);
        belonging.setPosition(nextPosition);
        belongingRepository.save(belonging);

        // 5. Retornar o DTO do jogo criado
        return new GameDTO(entity);
    }
    @Transactional // <--- ADD THIS TRANSACTIONAL ANNOTATION FOR THE DELETE METHOD
    public void delete(Long gameId) {
        // 1. Delete all associated belonging records first
        belongingRepository.deleteBelongingsByGameId(gameId);
        // 2. Now delete the game itself
        gameRepository.deleteById(gameId);
    }
    @Transactional
    public GameDTO update(Long id, GameUpdateDTO dto) {
        Game entity = gameRepository.findById(id).orElseThrow(() -> new RuntimeException("Game not found")); // Tratar caso não encontre
        entity.setTitle(dto.getTitle());
        entity.setYear(dto.getYear());
        entity.setScore(dto.getScore());
        entity.setImgUrl(dto.getImgUrl());
        entity.setShortDescription(dto.getShortDescription());
        entity.setLongDescription(dto.getLongDescription());
        entity = gameRepository.save(entity);
        return new GameDTO(entity);
    }
    @Transactional // Ensures the database operation is atomic
    public GameDTO updateGameRating(Long gameId, Double newRating) {
        // 1. Find the Game entity by its ID
        Game game = gameRepository.findById(gameId)
                                  .orElseThrow(() -> new IllegalArgumentException("Game not found with ID: " + gameId));
        // 2. Validate the incoming rating (e.g., ensure it's within a valid range like 0.0 to 5.0)
        if (newRating == null || newRating < 0.0 || newRating > 5.0) {
            throw new IllegalArgumentException("Invalid rating value. Rating must be between 0.0 and 5.0.");
        }
        // 3. Update the 'score' field of the Game entity with the new rating
        game.setScore(newRating);
        // 4. Save the updated Game entity back to the database
        game = gameRepository.save(game); // save() can also update if the entity exists
        // 5. Convert the updated Game entity to a GameDTO and return it
        return new GameDTO(game);
    }
}
