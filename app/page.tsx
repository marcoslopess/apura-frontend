"use client";

import { useMemo, useState, useEffect } from "react";
import { AppShell } from "@/components/layouts/app-shell";
import { SidebarNav } from "@/components/election/sidebar-nav";
import { ResultsView } from "@/components/election/results-view";
import { ConnectionBadge } from "@/components/election/connection-badge";
import { LastUpdateBadge } from "@/components/election/last-update-badge";
import { CargoSelector } from "@/components/election/cargo-selector";
import { StateSelectorModal } from "@/components/election/state-selector-modal";
import { usePresidente, useResultadoCargo } from "@/hooks/use-election-data";
import { useWebSocket } from "@/hooks/use-websocket";
import { extrairCandidatos, extrairTotalizacao } from "@/lib/process-results";
import { CARGOS, UFS, cargosDaUf } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";

const UF_STORAGE_KEY = "veltarc_uf";

export default function HomePage() {
  const queryClient = useQueryClient();
  const [selectedUf, setSelectedUf] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [cargo, setCargo] = useState("1"); // Presidente por padrão

  // Ao entrar na página, se nenhum estado foi escolhido, abre o modal
  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(UF_STORAGE_KEY) : null;
    if (saved) setSelectedUf(saved);
    else setModalOpen(true);
  }, []);

  const handleSelectUf = (uf: string) => {
    setSelectedUf(uf);
    if (typeof window !== "undefined") window.localStorage.setItem(UF_STORAGE_KEY, uf);
    setModalOpen(false);
  };

  const cargosEstado = useMemo(() => cargosDaUf(selectedUf), [selectedUf]);
  const cargosDisponiveis = useMemo(() => ["1", ...cargosEstado], [cargosEstado]);
  const cargoAtivo = cargosDisponiveis.includes(cargo) ? cargo : "1";
  const isPresidente = cargoAtivo === "1";

  const presRes = usePresidente();
  const ufRes = useResultadoCargo("uf", isPresidente ? "" : selectedUf, cargoAtivo);
  const { data, isLoading, isError } = isPresidente ? presRes : ufRes;

  const { status: wsStatus, isUpdating } = useWebSocket({ scope: isPresidente ? "br" : selectedUf || "br" });

  const candidatos = useMemo(() => extrairCandidatos(data?.carg?.[0]), [data]);
  const totalizacao = useMemo(() => extrairTotalizacao(data), [data]);

  const ufInfo = UFS.find((u) => u?.cd === selectedUf);
  const ufNome = ufInfo?.ds ?? selectedUf?.toUpperCase();

  const titulo = isPresidente
    ? "Presidente da República"
    : `${CARGOS[cargoAtivo] ?? "Cargo"}${ufNome ? ` — ${ufNome}` : ""}`;
  const cardTitle = isPresidente
    ? "Candidatos à Presidência — 1º Turno"
    : `${CARGOS[cargoAtivo] ?? "Cargo"} — ${ufNome ?? ""}`;

  const handleRefresh = () => {
    if (isPresidente) queryClient?.invalidateQueries?.({ queryKey: ["presidente"] });
    else queryClient?.invalidateQueries?.({ queryKey: ["resultado", "uf", selectedUf, cargoAtivo] });
  };

  const handleCargoSelect = (c: string) => {
    // Se escolher um cargo estadual sem estado definido, abre o modal
    if (c !== "1" && !selectedUf) {
      setModalOpen(true);
    }
    setCargo(c);
  };

  return (
    <AppShell
      sidebar={<SidebarNav />}
      header={
        <div className="flex flex-wrap items-center justify-between w-full gap-x-2 gap-y-1">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="font-display font-bold text-base sm:text-lg tracking-tight truncate">{titulo}</h1>
            <ConnectionBadge status={wsStatus} isUpdating={isUpdating} />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(true)}
              className="gap-1.5"
              title="Mudar estado"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span className="font-mono uppercase">{selectedUf || "UF"}</span>
            </Button>
            <LastUpdateBadge dataGeracao={totalizacao?.dataGeracao} horaGeracao={totalizacao?.horaGeracao} />
            <Button variant="ghost" size="icon-sm" onClick={handleRefresh} title="Atualizar">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      }
    >
      <StateSelectorModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        selectedUf={selectedUf}
        onSelect={handleSelectUf}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6">
          <Skeleton className="h-80 rounded-lg" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </div>
      ) : isError ? (
        <Card className="border-destructive/50">
          <CardContent className="p-8 text-center">
            <p className="text-destructive font-medium">Erro ao carregar dados</p>
            <p className="text-sm text-muted-foreground mt-1">Verifique a conexão com o backend</p>
            <Button variant="outline" className="mt-4" onClick={handleRefresh}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ResultsView
          candidatos={candidatos}
          totalizacao={totalizacao}
          cardTitle={cardTitle}
          cargoTabs={<CargoSelector cargos={cargosDisponiveis} selected={cargoAtivo} onSelect={handleCargoSelect} />}
        />
      )}
    </AppShell>
  );
}
