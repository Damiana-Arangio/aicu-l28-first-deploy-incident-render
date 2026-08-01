# Dati locali

Questa cartella ospita i database SQLite creati durante l'esecuzione.

Le configurazioni L25 usano file separati:

```txt
l25-a.sqlite
l25-b.sqlite
```

I file vengono creati automaticamente e sono esclusi da Git e dalla build
Docker. Non caricarli nella repository.

Le anteprime AI restano in memoria; soltanto le bozze confermate vengono
salvate nel database dell'ambiente attivo.
