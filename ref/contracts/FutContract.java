/* Copyright (C) 2013 Interactive Brokers LLC. All rights reserved.  This code is subject to the terms
 * and conditions of the IB API Non-Commercial License or the IB API Commercial License, as applicable. */

package com.ib.contracts;

import com.ib.client.Contract;

public class FutContract extends Contract {

   public FutContract(String symbol, String expiry) {
      m_symbol = symbol;
      m_secType = "FUT";
      m_exchange = "ONE";
      m_currency = "USD";
      m_expiry = expiry;
   }

   public FutContract(String symbol, String expiry, String currency) {
      m_symbol = symbol;
      m_secType = "FUT";
      m_currency = currency;
      m_expiry = expiry;
   }
}

