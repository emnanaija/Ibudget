import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoinService {
  private apiUrl = 'http://localhost:8090/coins';

  constructor(private http: HttpClient) {}

  getCoinList(page: number): Observable<Coin[]> {
    return this.http.get<any[]>(this.apiUrl, {
      params: new HttpParams().set('page', page.toString())
    }).pipe(
      map((coins: any[]) => coins.map(coin => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
        current_price: coin.current_price,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        market_cap: coin.market_cap,
        total_volume: coin.total_volume
      }))),
      catchError((error: any) => {
        console.error('Error fetching coins:', error);
        return throwError(() => new Error('Failed to load coins'));
      })
    );
  }


  // 2. Détails coin (market chart)
  getMarketChart(coinId: string, days: number): Observable<any> {
    const params = new HttpParams().set('days', days);
    return this.http.get(`${this.apiUrl}/${coinId}/chart`, { params });
  }

  // 3. Recherche par mot clé
  searchCoin(keyword: string): Observable<any> {
    const params = new HttpParams().set('q', keyword);
    return this.http.get(`${this.apiUrl}/search`, { params });
  }

  // 4. Top 50
  getTop50(): Observable<any> {
    return this.http.get(`${this.apiUrl}/top50`);
  }

  // 5. Coins tendances
  getTrending(): Observable<any> {
    return this.http.get(`${this.apiUrl}/trading`);
  }

  // 6. Détails coin simple
  getCoinDetails(coinId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/details/${coinId}`);
  }

}
interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap?: number;
  total_volume?: number;
}
