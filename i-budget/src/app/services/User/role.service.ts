import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http:HttpClient) { }
  private BASE_URL="http://localhost:8090/role";
  requestHeader = new HttpHeaders({ 'No-Auth': 'True' });

  getAllRoles():Observable<any>{
    const url = `${this.BASE_URL}/allRoles`;
    return this.http.get<any>(url);
  }
  getRoleByRoleId(roleId:string):Observable<any>{
    const url = `${this.BASE_URL}/getRole/${roleId}`;
    return this.http.get<any>(url);
  }
  deleteRoleByRoleId(roleId:string):Observable<any>{
    const url = `${this.BASE_URL}/deleteRole/${roleId}`;
    return this.http.delete<any>(url,{responseType: 'text' as 'json' });
  }
  addRole(roleName:string):Observable<any>{
    const url = `${this.BASE_URL}/addRole`;
    return this.http.post<any>(url,{roleName},{responseType: 'text' as 'json' });
  }
  updateRole(id:string,roleName:string):Observable<any>{
    const url = `${this.BASE_URL}/updateRole`;
    return this.http.patch<any>(url,{id,roleName},{responseType: 'text' as 'json' });
  }
}
