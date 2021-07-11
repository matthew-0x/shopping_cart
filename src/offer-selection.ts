import { FinalOfferMap, FinalOffer } from './offer';

export function resolveOffer(offerMap: FinalOfferMap): FinalOffer {
  // just selecting first offer.
  const chosenOffer = Object.values(offerMap)[0];
  const resolvedOffer: FinalOffer = {
    totalPrice: chosenOffer.totalPrice
  };
  if (chosenOffer.extraOffer) {
    resolvedOffer.extraOffer = chosenOffer.extraOffer;
  }
  return resolvedOffer;
}
