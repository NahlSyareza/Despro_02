<script>
  import { Router, Link, Route } from "svelte-routing";

  import Home from "./routes/Home.svelte";
  import Fill from "./routes/Fill.svelte";
  import Redirector from "./utils/Redirector.svelte";
</script>

<main>
  <Router>
    <div>
      <Route path="/"><Redirector to="/home" /></Route>
      <Route path="/fill/:idtr" let:params><Fill idtr={params.idtr} /></Route>
      <Route path="/home"><Home /></Route>
    </div>
  </Router>
</main>
