package ar.edu.laboratorio.productos.controller;

import ar.edu.laboratorio.productos.model.Producto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final List<Producto> productos = new ArrayList<>();
    private long siguienteId = 3;

    public ProductoController() {

        productos.add(new Producto(1L, "Cuaderno", 2500.0, 10));
        productos.add(new Producto(2L, "Lapicera", 800.0, 20));
        productos.add(new Producto(3L, "Regla", 350.0, 15)); 
        productos.add(new Producto(4L, "Borrador", 400.0, 7));
        productos.add(new Producto(5L, "Calculadora", 1500.0, 5)); 
        
    }

    @GetMapping
    public synchronized List<Producto> listar() {

        return new ArrayList<>(productos);

    }
    @GetMapping("/stock-total")
    public synchronized int calcularStockTotal() {

        int total = 0;

        for (Producto producto : productos) {
            total = total + producto.getStock();
        }

        return total;
    }

    @PostMapping
    public synchronized ResponseEntity<?> agregar(
            @RequestBody Producto producto) {

        if (producto.getNombre() == null ||
                producto.getNombre().isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error",
                            "Debés ingresar un nombre para el producto."));
        }

        if (producto.getPrecio() == null ||
                producto.getPrecio() <= 0) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error",
                            "El precio debe ser mayor que cero."));
        }

        if (producto.getStock() == null ||
                producto.getStock() < 0) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error",
                            "El stock es obligatorio y no puede ser negativo."));
        }

        producto.setId(siguienteId++);

        producto.setNombre(producto.getNombre().trim());
        
        productos.add(producto);

        return ResponseEntity.status(201).body(producto);
    }
}