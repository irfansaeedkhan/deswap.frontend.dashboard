function StockPicker(arr) {

    var max_profit = -1;
    var buy_price = 0;
    var sell_price = 0;
    var change_buy_index = true;

    for (var i = 0; i < arr.length - 1; i++) {

        sell_price = arr[i + 1];
        if (change_buy_index) { buy_price = arr[i]; }
        if (sell_price < buy_price) {
            change_buy_index = true;
            continue;
        } else {
            var temp_profit = sell_price - buy_price;
            if (temp_profit > max_profit) { max_profit = temp_profit; }
            change_buy_index = false;
        }

    }

    return max_profit;

}

StockPicker([44, 30, 24, 32, 35, 30, 40, 38, 15]);