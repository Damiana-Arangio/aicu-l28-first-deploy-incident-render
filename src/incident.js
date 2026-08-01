import {
  discardIncidentPreview,
  generateIncidentPreview,
  loadIncidentDrafts,
  loadTickets,
  saveIncidentDraft
} from "./incident-api.js";
import {
  clearPreview,
  elements,
  enforceSelectionLimit,
  getSelectedTicketIds,
  readRevision,
  renderPreview,
  renderSavedDrafts,
  renderTickets,
  setBusy,
  setStatus
} from "./incident-view.js";

let currentPreview = null;

elements.ticketList.addEventListener("change", enforceSelectionLimit);
elements.generateButton.addEventListener("click", () => generateAndRender());
elements.previewForm.addEventListener("click", handlePreviewAction);

await initialize();

async function initialize() {
  try {
    const [tickets, drafts] = await Promise.all([
      loadTickets(),
      loadIncidentDrafts()
    ]);
    renderTickets(tickets);
    renderSavedDrafts(drafts);
    setStatus("Seleziona da due a quattro ticket.");
  } catch {
    setStatus("Impossibile inizializzare il lab.", "error");
  }
}

async function generateAndRender(ticketIdsOverride) {
  const ticketIds = ticketIdsOverride || getSelectedTicketIds();

  if (ticketIds.length < 2 || ticketIds.length > 4) {
    setStatus("Seleziona da due a quattro ticket.", "error");
    return;
  }

  setBusy(true);
  setStatus("Generazione in corso...", "loading");

  try {
    if (currentPreview) {
      await discardIncidentPreview(currentPreview.id);
    }

    const result = await generateIncidentPreview({
      ticketIds,
      scenario: elements.scenario.value
    });

    if (!result.ok) {
      throw new Error(result.reason || "generation_failed");
    }

    currentPreview = result.preview;
    renderPreview(currentPreview);
    setStatus("Sintesi generata. L'anteprima non e' ancora salvata.", "success");
  } catch (error) {
    currentPreview = null;
    clearPreview();
    setStatus(`Generazione fermata: ${error.message}.`, "error");
  } finally {
    setBusy(false);
  }
}

async function handlePreviewAction(event) {
  const action = event.target.closest("button[data-action]")?.dataset.action;

  if (!action || !currentPreview) {
    return;
  }

  if (action === "regenerate") {
    await generateAndRender(currentPreview.draft.affectedTicketIds);
    return;
  }

  if (action === "discard") {
    setBusy(true);
    try {
      await discardIncidentPreview(currentPreview.id);
      currentPreview = null;
      clearPreview();
      setStatus("Sintesi scartata. Nessuna bozza salvata.", "success");
    } catch (error) {
      setStatus(`Scarto non riuscito: ${error.message}.`, "error");
    } finally {
      setBusy(false);
    }
    return;
  }

  if (action === "save") {
    await saveCurrentDraft();
  }
}

async function saveCurrentDraft() {
  setBusy(true);
  setStatus("Salvataggio esplicito in corso...", "loading");

  try {
    const result = await saveIncidentDraft({
      previewId: currentPreview.id,
      draft: readRevision()
    });
    currentPreview = null;
    clearPreview();
    renderSavedDrafts(await loadIncidentDrafts());
    setStatus(`Bozza ${result.draft.id} salvata.`, "success");
  } catch (error) {
    setStatus(`Salvataggio fermato: ${error.message}.`, "error");
  } finally {
    setBusy(false);
  }
}
