package com.devsuperior.dslist.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devsuperior.dslist.dto.GameListDTO;
import com.devsuperior.dslist.entities.GameList;
import com.devsuperior.dslist.repositories.GameListRepository;

import com.devsuperior.dslist.dto.ReplacementDTO;
import com.devsuperior.dslist.entities.Belonging;
import com.devsuperior.dslist.repositories.BelongingRepository;

@Service
public class GameListService {

	@Autowired
	private GameListRepository gameListRepository;

	@Autowired
	private BelongingRepository belongingRepository;

	
	@Transactional(readOnly = true)
	public List<GameListDTO> findAll() {
		List<GameList> result = gameListRepository.findAll();
		return result.stream().map(GameListDTO::new).toList();
	}
	@Transactional
    public void move(Long listId, ReplacementDTO body) {
        List<Belonging> belongings = belongingRepository.findByListId(listId);

        int sourceIndex = body.getSourceIndex();
        int destinationIndex = body.getDestinationIndex();

        if (sourceIndex < 0 || sourceIndex >= belongings.size() || 
            destinationIndex < 0 || destinationIndex >= belongings.size()) {
            throw new IllegalArgumentException("Invalid source or destination index");
        }

        Belonging sourceBelonging = belongings.get(sourceIndex);
        belongings.remove(sourceIndex);
        belongings.add(destinationIndex, sourceBelonging);

        for (int i = 0; i < belongings.size(); i++) {
            belongings.get(i).setPosition(i);
        }

        belongingRepository.saveAll(belongings);
    }
}