import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Definimos la estructura de nuestra Meta
export interface Meta {
  id: string;
  texto: string;
}

@Injectable({
  providedIn: 'root'
})
export class MetasService {
  private http = inject(HttpClient);
  
  
  private baseUrl = 'https://firestore.googleapis.com/v1/projects/lifegoals-11fb2/databases/(default)/documents/metas';

  getMetas(): Observable<Meta[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(response => {
        if (!response.documents) return []; // Si no hay metas, devuelve arreglo vacío
        return response.documents.map((doc: any) => {
          // Extraemos el ID del final de la URL del documento
          const pathParts = doc.name.split('/');
          const id = pathParts[pathParts.length - 1];
          // Extraemos el texto del campo 'meta'
          const texto = doc.fields && doc.fields.meta ? doc.fields.meta.stringValue : '';
          return { id, texto };
        });
      })
    );
  }

  // 2. AÑADIR UNA NUEVA META (POST)
  addMeta(textoMeta: string): Observable<any> {
    const payload = {
      fields: {
        meta: { stringValue: textoMeta }
      }
    };
    // Al hacer POST a la colección, Firestore genera un ID automáticamente
    return this.http.post(this.baseUrl, payload);
  }

  // 3. ELIMINAR UNA META (DELETE)
  deleteMeta(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
