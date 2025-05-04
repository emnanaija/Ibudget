import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnexionInfoService {
  private BASE_URL="http://localhost:8090/connexionInfo";
  
  requestHeader = new HttpHeaders({ 'No-Auth': 'True' });

   constructor(private http:HttpClient) { }

approveDevice(resetToken:string):Observable<any>{
const url=`${this.BASE_URL}/approveLogIn?token=${resetToken}`; 
return this.http.post<any>(url, {},{
  headers: this.requestHeader,
  responseType: 'text' as 'json' 
});

}
getDeviceConnexionInfoByDeviceId(deviceId:string):Observable<any>{
  const url = `${this.BASE_URL}/getById?id=${deviceId}`;
  const token = localStorage.getItem('accessToken'); 
  return this.http.get<any>(url);
}
getAllDevices():Observable<any>{
  const url = `${this.BASE_URL}/getAll`;
  return this.http.get<any>(url);
}
deleteDeviceConnexionInfoByDeviceId(deviceId:string):Observable<any>{
  const url = `${this.BASE_URL}/deleteById?id=${deviceId}`;
  const token = localStorage.getItem('accessToken'); 
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  return this.http.delete<any>(url,{ headers,responseType: 'text' as 'json' });
}
changeApproval(id:string,value:boolean):Observable<any>{
  const url = `${this.BASE_URL}/changeApproval`;
  const token = localStorage.getItem('accessToken'); 
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  
  return this.http.patch<any>(url,{id,value},{ headers,responseType: 'text' as 'json'});
}
}
