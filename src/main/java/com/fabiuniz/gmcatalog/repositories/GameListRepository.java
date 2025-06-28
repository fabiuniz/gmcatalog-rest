package com.gamecatalog.gmcatalog.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.gamecatalog.gmcatalog.entities.GameList;

import java.util.Optional; // Importe Optional

public interface GameListRepository extends JpaRepository<GameList, Long> {

    // Método para buscar uma GameList pelo nome
    // O Spring Data JPA infere a query a partir do nome do método
    Optional<GameList> findByName(String name);

    @Modifying
    @Query(nativeQuery = true,
        value = "UPDATE tb_belonging SET position = :newPosition WHERE list_id = :listId AND game_id = :gameId")
    void updateBelongingPosition(Long listId, Long gameId, Integer newPosition);
}