package com.devsuperior.dslist.repositories;

import com.devsuperior.dslist.entities.Belonging;
import com.devsuperior.dslist.entities.BelongingPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BelongingRepository extends JpaRepository<Belonging, BelongingPK> {

    @Query("SELECT b FROM Belonging b WHERE b.id.list.id = :listId ORDER BY b.position")
    List<Belonging> findByListId(Long listId);
}