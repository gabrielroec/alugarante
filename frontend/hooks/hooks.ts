import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";

// Hook para usar o dispatch com tipagem
export const useAppDispatch: () => AppDispatch = useDispatch;
