      #region Random CC Generator
      /// <summary>
      /// Generate a valid credit card number randomly this is a test
      /// </summary>
      /// <returns>Returns a string that represents a credit card number.</returns>
      public static string CreditCardNumbers()
      {
          string digits = "4" + AllPurposeNumberGenerator(10000000000000, 99999999999999, 14).ToString();
          int checksum = LuhnAlgorithm(digits) % 10;
          int cs = LuhnAlgorithm(digits + "0") % 10;
          if (cs > 0)
          {
              int checkDigit = 10 - cs;
              return digits + checkDigit.ToString();
          }
          else
          {
              string checkDigit = "0";
              return digits + checkDigit;
          }
      }

      /// <summary>
      /// This is a checker for valid credit card numbers
      /// </summary>
      /// <returns></returns>
      public static int LuhnAlgorithm(string digits)
      {
          int res = 0;
          int inc = digits.Length % 2;
          for (var i = 0; i < digits.Length; i++)
          {
              int n = Convert.ToInt32(digits.Substring(i, 1)) * (2 - (i + inc) % 2);
              res += n > 9 ? n - 9 : n;
          }
          return res;
      }


      #endregion

      #region Random Number Generators
      /// <summary>
      /// This method serves as a general generator for any number within any range and any character length long.
      /// </summary>
      /// <param name="startingRange"></param>
      /// <param name="endingRange"></param>
      /// <param name="numberOfDigits"></param>
      /// <returns></returns>
      public static int AllPurposeNumberGenerator(int startingRange, int endingRange, int numberOfDigits)
      {
          Random numberGenerator = new Random();
          string randomAccountNumber = string.Empty;
          int randomInt = 0;
          while (randomAccountNumber.Length < numberOfDigits)
          {
              randomInt = numberGenerator.Next(startingRange, endingRange);
              randomAccountNumber = randomInt.ToString();
          }
          return randomInt;
      }

      /// <summary>
      /// Generate a random number
      /// </summary>
      /// <param name="startingRange"></param>
      /// <param name="endingRange"></param>
      /// <param name="numberOfDigits"></param>
      /// <returns>Returns a long variable</returns>
      public static long AllPurposeNumberGenerator(long startingRange, long endingRange, int numberOfDigits)
      {
          Random numberGenerator = new Random();
          string randomAccountNumber = string.Empty;
          long randomLong = 0;
          while (randomAccountNumber.Length < numberOfDigits)
          {
              randomLong = numberGenerator.Next((Int32)(startingRange >> 32), (Int32)(endingRange >> 32));
              randomLong = (randomLong << 32);
              randomAccountNumber = randomLong.ToString();
          }
          return randomLong;
      }


      #endregion
