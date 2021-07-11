import {  FinalOffer, Offers, ProductOffer } from './offer';
import { resolveOffer } from './offer-selection';
import { Products } from './product';

export interface CheckoutItemMap {
  [key: string]: number;
}

export type CheckoutItemDetail = ProductOffer;

export interface CheckoutItemDetailMap {
  /**
   * {
   *  iPads: {
   *    productName: 'iPadAir',
   *    quantity: 2,
   *    price: 1000 //each
   *  }
   * }
   */
  [key : string] : CheckoutItemDetail; // key is productName
}

export class Checkout {
  private offerService: Offers;
  private productService: Products;
  public constructor(productService: Products, offerService: Offers) {
    this.offerService = offerService;
    this.productService = productService;
  }
  public checkout(checkoutMap: CheckoutItemMap): FinalOffer {
    // Queries the products service and constructs the bill
    const checkoutDetailedMap = Object.keys(checkoutMap)
    .reduce((finalMap: CheckoutItemDetailMap, item: string): CheckoutItemDetailMap => {
      const product = this.productService.getProduct(item);
      if (product) {
        const checkoutItemDetail: CheckoutItemDetail = {
          productName: item,
          price: product.price,
          quantity: checkoutMap[item]
        };
        finalMap[item] = checkoutItemDetail;
      }
      return finalMap;
    },      {});
    /**
     * applyOffers will return something like:
     *   {
     *     offerId : {
     *       id: 'offerId',
     *       totalPrice: 100,
     *       extraOffer: {
     *         OurProduct : {
     *           productName: 'product_Xy',
     *           quantity: 3,
     *           price: 0
     *         }
     *       }
     *     }
     *   };
     *   Offer resolution will turn it into:
     *   {
     *    totalPrice: 100,
     *    extraOffer: {
     *       OurProduct: {
     *         productName: 'product_Xy',
     *         quantity: 3,
     *         price: 0
     *       }
     *     }
     *   }
     */
    const res = this.offerService.applyOffers(checkoutDetailedMap);
    return resolveOffer(res);
  }
}
