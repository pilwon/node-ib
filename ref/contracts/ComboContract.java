/* Copyright (C) 2013 Interactive Brokers LLC. All rights reserved.  This code is subject to the terms
 * and conditions of the IB API Non-Commercial License or the IB API Commercial License, as applicable. */

package com.ib.contracts;

import com.ib.client.Contract;

public class ComboContract extends Contract {

   public ComboContract(String symbol) {
      m_symbol = symbol;
      m_secType = "BAG";
      m_currency = "USD";
      m_exchange = "SMART";
   }

   public ComboContract(String symbol, String currency) {
      m_symbol = symbol;
      m_secType = "BAG";
      m_currency = currency;
      m_exchange = "SMART";
   }

   public ComboContract(String symbol, String currency, String exchange) {
      m_symbol = symbol;
      m_secType = "BAG";
      m_currency = currency;
      m_exchange = exchange;
   }
}


