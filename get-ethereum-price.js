/*
 * Copyright (c) 2023.
 * This file is a part of the dexstein samples project
 * Created by Asaf on 25.3.2023, 14:16
 * LICENSE: MIT
 * FEEL FREE TO USE AND SHARE
 */

/**
 * HOW to get the current Ethereum price from uniswap V3 pool without using uniswap API
 * This is a simple and accurate method. can be also be the base for retrieving
 * any ERC20 token price.
 */

const ethers = require("ethers");

/**
 * ABi and pool definitions
 **/
const _slot0Abi = require('./uv3_slotABI.json');
const _pairId = '0x11b815efb8f581194ae79006d24e0d814b7697f6';
const _decimals_WETH = 18;
const _decimals_USDT = 6;

/**
 * change to any rpc provider
 * https://www.quicknode.com/ free plan is a great start
 * @type {string}
 * @private
 */
const _providerUrl = 'https://***.quiknode.pro/***';

(async () => {
    const ethPrice = await getChainCurrencyValue();
    console.log(ethPrice);
})();

async function getChainCurrencyValue() {
    try {
        const newCon = new ethers.JsonRpcProvider(_providerUrl);

        const contract = new ethers.Contract(_pairId, _slot0Abi, newCon);
        const slotData = await contract.slot0();
        if (slotData) {
            const sqrtPriceX96 = slotData?.sqrtPriceX96;
            const price = sqrtPriceX96ToFactor(sqrtPriceX96.toString(), _decimals_WETH, _decimals_USDT);
            return price;
        }
    } catch (e) {
        console.error(e);
    }

    return 0;
}

function sqrtPriceX96ToFactor(sqrtPriceX96, decimals0, decimals1) {
    return sqrtPriceX96 * sqrtPriceX96 * (10 ** decimals0) / (10 ** decimals1) / (2) ** (192);
}
