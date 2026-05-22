import { Component, OnInit, inject, signal } from '@angular/core';
import { MetasService, Meta } from './metas.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false 
})
export class App implements OnInit {
  private metasService = inject(MetasService);
  
  // Usamos Signals para la lista de metas
  listaMetas = signal<Meta[]>([]);
  
  // Nueva señal para controlar la pestaña activa (inicia en 'home')
  tabActiva = signal<string>('home'); 

  ngOnInit() {
    this.cargarMetas();
  }

  // Método para cambiar de pestaña
  cambiarTab(tab: string) {
    this.tabActiva.set(tab);
  }

  // Método para refrescar la lista
  cargarMetas() {
    this.metasService.getMetas().subscribe((datos: Meta[]) => {
      this.listaMetas.set(datos);
    });
  }

  // Método para agregar
  agregarMeta(inputElement: HTMLInputElement) {
    const nuevoTexto = inputElement.value.trim();
    if (nuevoTexto) {
      this.metasService.addMeta(nuevoTexto).subscribe(() => {
        inputElement.value = ''; // Limpiamos la caja de texto
        this.cargarMetas();      // Recargamos la lista para ver el cambio
      });
    }
  }

  // Método para eliminar
  eliminarMeta(id: string) {
    this.metasService.deleteMeta(id).subscribe(() => {
      this.cargarMetas(); // Recargamos la lista tras borrar
    });
  }
}
