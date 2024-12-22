import { atom } from "jotai";
import { SearchResult } from "../../../api"

export const searchResult = atom<SearchResult | undefined>(undefined);
