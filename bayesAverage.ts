/**
 * We have a list of products.
 * Each product has a rating (1-5), a count of received ratings, and its average rating.
 *
 * But, we don’t want to blindly trust a products average rating.
 * The more ratings a product has, the more confidence you can have in its average rating.
 * Conversely, the less ratings a product has, the less confidence we can have in its average rating.
 *
 * Instead of
 *
 * Instead of using the average review rating,
 * we can calculate a new rating score to say:
 * > as the number of ratings on an item increase,
 * > the score should move from the lists average rating to the items average rating.
 *
 * Given that the average product review rating is 4.2,
 * and 25% of products have 10 reviews (lower quartile),
 * - if an item in is the lower quartile of reviews, the score should be around the average product review
 * - if an item has more than the lower quartile of reviews, the score should be the products average review
 *
 * If a product has 1 review, and an average rating of 5,
 * we can calculate our new score with a simple formula for [Bayesian Average]:
 * - (itemRatings * itemRatingsAverage + listMean * listConfidence) / (itemRatings + listConfidence)
 * - (1 * 5 + 4.2 * 10) / (1 + 10) = 4.27
 *
 * If a product has 10 reviews, and an average rating of 5,
 * we can calculate our new score with a simple formula for [Bayesian Average]:
 * - (itemRatings * itemRatingsAverage + listMean * listConfidence) / (itemRatings + listConfidence)
 * - (10 * 5 + 4.2 * 10) / (10 + 10) = 4.6
 *
 * If a product has 100 reviews, and an average rating of 5,
 * we can calculate our new score with a simple formula for [Bayesian Average]:
 * - (itemRatings * itemRatingsAverage + listMean * listConfidence) / (itemRatings + listConfidence)
 * - (100 * 5 + 4.2 * 10) / (100 + 10) = 4.93
 *
 * For calculating the list average and list threshold (Bayesian constants: mean and confidence),
 * you can create a batch job that runs once a week or month.
 * These constants don’t need to change that often.
 *
 * It’s important to store these constants so that you can calculate all products based on the same constants.
 * Thus, whenever you change these constants, you should recalculate every products Bayesian average.
 *
 * @param itemRatings
 * @param itemRatingsAverage
 * @param listAverage
 * @param listThreshold
 * @returns calculated bayesian average
 */
export default function bayesianAverage(
    itemRatings: number,
    itemRatingsAverage: number,
    listAverage: number,
    /** Confidence */
    listThreshold: number
) {
    return (
        (itemRatings * itemRatingsAverage + listAverage * listThreshold) /
        (itemRatings + listThreshold)
    );
}

type BayesConstants = {
    /** average rating of all items */
    mean: number;
    /** confidence number based on quartile */
    confidence: number;
};

/**
 * For calculating the Bayesian constants (mean and confidence),
 * you can create a batch job that runs once a week or month.
 * These constants don’t need to change that often.
 *
 * It’s important to store these constants so that you can calculate all products based on the same constants.
 * Thus, whenever you change these constants, you should recalculate every products Bayesian average.
 */
const bayesConstants: BayesConstants = {
    mean: 0,
    confidence: 100,
};

/**
 * The Bayesian average uses two constants to offset the arithmetic average of an individual item:
 * - the lists average rating
 * - a threshold number (confidence number)
 *
 * Each item must have:
 * - an average rating
 * - count of ratings
 *
 * https://www.algolia.com/doc/guides/managing-results/must-do/custom-ranking/how-to/bayesian-average/#understanding-the-bayesian-average
 * https://arpitbhayani.me/blogs/bayesian-average
 */
