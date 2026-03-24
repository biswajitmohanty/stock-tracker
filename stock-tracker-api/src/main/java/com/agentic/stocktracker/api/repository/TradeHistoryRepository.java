package com.agentic.stocktracker.api.repository;

import com.agentic.stocktracker.api.entity.TradeHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TradeHistoryRepository extends JpaRepository<TradeHistory, Long> {
    List<TradeHistory> findAllByOrderByTradeDateDesc();
    List<TradeHistory> findBySymbolOrderByTradeDateDesc(String symbol);
}
