// deno test tests/averageRating.test.ts
import { assertEquals } from 'https://deno.land/std@0.145.0/testing/asserts.ts';
import bayesianAverage from '../bayesAverage.ts';
import quantileSorted from '../simple-statistics/quantile_sorted.ts';
import sumSimple from '../simple-statistics/sum_simple.ts';

type Product = {
    name: string;
    ratings: number;
    ratingsAverage: number;
    /** The field we want to calculate. */
    bayesianAverage?: number;
};

type BayesConstants = {
    /** average rating of all items */
    mean: number;
    /** confidence number based on quartile */
    confidence: number;
};

const bayesConstants: BayesConstants = {
    mean: 0,
    confidence: 100,
};

const testCases = [
    {
        bayesConstants: {
            mean: 4.2,
            confidence: 10,
        },
        product: {
            name: '1:',
            ratings: 1,
            ratingsAverage: 5,
        },
    },
    {
        bayesConstants: {
            mean: 4.2,
            confidence: 10,
        },
        product: {
            name: '1::',
            ratings: 10,
            ratingsAverage: 5,
        },
    },
    {
        bayesConstants: {
            mean: 4.2,
            confidence: 10,
        },
        product: {
            name: '1::',
            ratings: 100,
            ratingsAverage: 5,
        },
    },
];

testCases.forEach((test) => {
    const bayesAverage = bayesianAverage(
        test.product.ratings,
        test.product.ratingsAverage,
        test.bayesConstants.mean,
        test.bayesConstants.confidence
    );
    console.log(test.product.name);
    console.group();
    console.log(
        `colAvg: ${test.bayesConstants.mean} itemAvg:${test.product.ratingsAverage} n:${test.product.ratings} c: ${test.bayesConstants.confidence}`
    );
    console.log(bayesAverage.toFixed(2));
    console.groupEnd();
});

const testItem: Product = {
    name: 'Item A',
    ratings: 100,
    ratingsAverage: 5,
    bayesianAverage: 0,
};

// console.log(bayesianAverage(testItem.ratings, testItem.ratingsAverage, 3, 100));

// const products = generateProductData(100);

const products: Product[] = [
    {
        name: 'Item A',
        ratings: 10,
        ratingsAverage: 5,
        bayesianAverage: 0,
    },
    {
        name: 'Item B',
        ratings: 100,
        ratingsAverage: 4.8,
        bayesianAverage: 0,
    },
    {
        name: 'Item C',
        ratings: 1000,
        ratingsAverage: 4.6,
        bayesianAverage: 0,
    },
];

const sortedProductRatingsArray = products.map((product) => product.ratings);
const ratingsQuantile25 = quantileSorted(sortedProductRatingsArray, 0.25);

const overallRatings = products.map((product) => product.ratingsAverage);
const meanOfOverallRatingAverage =
    sumSimple(overallRatings) / overallRatings.length;

const bayesProducts = products.map((product) => {
    return {
        ...product,
        bayesianAverage: bayesianAverage(
            product.ratings,
            product.ratingsAverage,
            meanOfOverallRatingAverage,
            100
        ),
    };
});

// console.log(
//     bayesProducts.sort((a, b) => b.bayesianAverage - a.bayesianAverage)
// );

// products.forEach((product) => {
//     console.log(product.name);
//     console.group();
//     console.log('ratings: ' + product.ratings);
//     console.log('ratingsAverage: ' + product.ratingsAverage);
//     console.log(
//         'bayesianAverage: ' +
//             bayesianAverage(
//                 product.ratings,
//                 product.ratingsAverage,
//                 meanOfOverallRatingAverage,
//                 ratingsQuantile25
//             )
//     );
//     console.groupEnd();
// });

console.log({ ratingsQuantile25 });
console.log({ meanOfOverallRatingAverage });

// Deno.test('Base64 Encode URL', () => {
//     const input = 'http://localhost:3000';
//     assertEquals(encodeBase64(input), 'aHR0cDovL2xvY2FsaG9zdDozMDAw');
// });

function generateProductData(n: number): Product[] {
    return [...Array(n)].map((_, index) => ({
        name: `Item ${index}`,
        ratings: getRandomInt(1, 10),
        ratingsAverage: getRandomInt(1, 5),
        bayesianAverage: 0,
    }));
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
