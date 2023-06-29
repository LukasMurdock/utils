// https://usehooks.com/useLocalStorage/
import { useState } from 'react';

type SetValue<T> = React.Dispatch<React.SetStateAction<T>>;

/**
 * A hook to get and set values in local storage.
 *
 * A validator function is used to ensure the data is valid.
 */
export function useLocalStorage<TValue>(
    key: string,
    initialValue: TValue,
    validator: (parsed: any) => TValue
): [TValue, SetValue<TValue>] {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            if (!item) {
                return initialValue;
            }
            const parsed = JSON.parse(item);
            // Parse stored json or if none return initialValue
            const validated = validator(parsed);
            if (validated) {
                return validated;
            } else {
                return initialValue;
            }
        } catch (error) {
            // If error also return initialValue
            console.log(error);
            return initialValue;
        }
    });
    // Return a wrapped version of useState's setter function
    // to persist the new value to localStorage.
    const setValue: SetValue<TValue> = (value) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            // Could handle the error case
            console.log(error);
        }
    };
    return [storedValue, setValue];
}
