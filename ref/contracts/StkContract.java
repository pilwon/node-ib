/* Copyright (C) 2013 Interactive Brokers LLC. All rights reserved.  This code is subject to the terms
 * and conditions of the IB API Non-Commercial License or the IB API Commercial License, as applicable. */

package com.ib.contracts;

import com.ib.client.Contract;

public class StkContract extends Contract {

   public StkContract(String symbol) {
      m_symbol = symbol;
      m_secType = "STK";
      m_exchange = "SMART";
      m_currency = "USD";
   }
}

