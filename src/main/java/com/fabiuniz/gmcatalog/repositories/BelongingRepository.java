package com.fabiuniz.gmcatalog.repositories;

import com.fabiuniz.gmcatalog.entities.Belonging;
import com.fabiuniz.gmcatalog.entities.BelongingPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional; // IMPORTANT: Ensure this is imported

import java.util.List;

public interface BelongingRepository extends JpaRepository<Belonging, BelongingPK> {

    @Query("SELECT b FROM Belonging b WHERE b.id.list.id = :listId ORDER BY b.position")
    List<Belonging> findByListId(Long listId);

    @Modifying
    @Transactional // This is crucial for DML operations in Spring Data JPA
    @Query(nativeQuery = true, value = "DELETE FROM tb_belonging WHERE game_id = :gameId")
    void deleteBelongingsByGameId(Long gameId);
}