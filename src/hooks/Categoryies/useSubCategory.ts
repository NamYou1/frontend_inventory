import type { SubCategoryFilter, SubCategoryForm } from "@/types/SubCategory.type";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { categoryKeys } from "./useCategory";
import { SubCategoryService } from "@/services/SubCategory";





export const categoryKey = {
    all  : ["subCategory"] as const , 
    lists: ()=>[...categoryKey.all,"list"] as const,
    list : (filter:SubCategoryFilter) => [...categoryKey.lists(),filter] as const,
    detail : (id:number)=> [...categoryKey.all,"detail",id] as const,
}


export function useSubCategories(filter:SubCategoryFilter){
    return useQuery({
        queryKey:categoryKey.list(filter),
        queryFn:()=>SubCategoryService.getAll(filter),
        placeholderData:keepPreviousData,
    })
}

export function useCreateSubCategory(){
    const qc = useQueryClient()
    return useMutation({
        mutationFn:SubCategoryService.create,
        onSuccess:()=>qc.invalidateQueries({queryKey:categoryKey.lists()}),
    })
}

export function useUpdateSubCategory(){
    const qc = useQueryClient()
    return useMutation({
        mutationFn:({id,data}:{id:number,data:SubCategoryForm})=>SubCategoryService.update(id,data),
        onSuccess:(_, { id }) => {
            qc.invalidateQueries({ queryKey: categoryKeys.lists() });
            qc.invalidateQueries({ queryKey: categoryKeys.detail(id) });
          },
    })
}

export function useDeleteSubCategory(){
    const qc = useQueryClient()
    return useMutation({
        mutationFn:SubCategoryService.delete,
        onSuccess:()=>qc.invalidateQueries({queryKey:categoryKey.lists()}),
    })
}