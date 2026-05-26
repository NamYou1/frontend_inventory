import api from "@/api/axios";
import type {ISubCategory, SubCategoryFilter, SubCategoryForm} from "@/types/SubCategory.type";
import type { ApiResponse } from "@/utils/Pagination";

export const SubCategoryService = {
    getAll: (filter: SubCategoryFilter = {}): Promise<ApiResponse<ISubCategory[]>> =>
        api.get("subcategory", {
            params: {
                page: filter.page,
                size: filter.size,
                ...(filter.name && { name: filter.name }),
                ...(filter.code && { code: filter.code }),
                ...(filter.categoryId && { categoryId: filter.categoryId }),
                ...(filter.status && { status: filter.status })
            },
        }).then((res) => res.data),

    getById: (id: number): Promise<ApiResponse<ISubCategory>> =>
        api.get(`subcategory/${id}`).then((res)=>res.data),

    create : (data : SubCategoryForm): Promise<ApiResponse<ISubCategory>> =>
        api.post("subcategory" , data).then((res)=>res.data),

  
  update: (id: number, data: SubCategoryForm): Promise<ApiResponse<ISubCategory>> =>
    api.put(`subcategory/${id}`, data).then((res) => res.data),

  
  delete: (id: number): Promise<ApiResponse<null>> =>
    api.post(`subcategory/${id}`).then((res) => res.data),

}