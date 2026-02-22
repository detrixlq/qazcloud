import React, { useState } from 'react';
import { Bot, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Message as MessageType } from '../../contexts/ChatContext';

interface DiagnosisMessageProps {
  message: MessageType;
}

/** Builds protocol page URL for the given ICD-10 code (replace with real API/base URL when backend is ready). */
function getProtocolPageUrl(icd10Code: string): string {
  return `/protocol?code=${encodeURIComponent(icd10Code)}`;
}

export const DiagnosisMessage: React.FC<DiagnosisMessageProps> = ({ message }) => {
  const { t } = useLanguage();
  const detailsSections = message.diagnosisData?.detailsSections;
  const hasBackendDetails = Boolean(detailsSections?.length);
  const [detailsOpen, setDetailsOpen] = useState(hasBackendDetails);
  const [secondaryOpen, setSecondaryOpen] = useState<Record<number, boolean>>({});

  const diag = message.diagnosisData?.diagnoses ?? [];
  const primary = diag.find((d) => d.rank === 1);
  const secondary = diag.filter((d) => d.rank > 1);

  const toggleSecondary = (rank: number) => {
    setSecondaryOpen((o) => ({ ...o, [rank]: !o[rank] }));
  };

  const openDetails = () => {
    if (!primary) return;
    setDetailsOpen((o) => !o);
  };

  const handleOpenProtocol = () => {
    if (!primary) return;
    const url = getProtocolPageUrl(primary.icd10_code);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const protocolButtonLabel = primary
    ? t.viewDiagnosisProtocol.replace('{diagnosis}', primary.diagnosis)
    : '';

  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
        <Bot size={16} className="text-primary" />
      </div>
      <div className="flex max-w-[85%] flex-1 flex-col gap-2">
        <div className="rounded-2xl bg-gray-200 px-4 py-2.5 dark:bg-gray-700">
          {message.content && <p className="mb-2 text-sm text-gray-900 dark:text-gray-100">{message.content}</p>}
          {primary && (
            <div className="mb-2 rounded-lg border border-primary/30 bg-primary/5 p-3 dark:bg-primary/10">
              <p className="font-semibold text-primary">#{primary.rank} {primary.diagnosis}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">ICD-10: {primary.icd10_code}</p>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{primary.explanation}</p>
            </div>
          )}
          {secondary.length > 0 && (
            <div className="space-y-1">
              {secondary.map((d) => (
                <div key={d.rank} className="rounded border border-gray-200 dark:border-gray-600">
                  <button
                    type="button"
                    onClick={() => toggleSecondary(d.rank)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <span>#{d.rank} {d.diagnosis} ({d.icd10_code})</span>
                    {secondaryOpen[d.rank] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {secondaryOpen[d.rank] && (
                    <div className="border-t border-gray-200 px-3 py-2 text-xs text-gray-600 dark:border-gray-600 dark:text-gray-400">
                      {d.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={openDetails}
            className="mt-2 flex w-full items-center justify-between rounded-lg bg-gray-100 px-3 py-2 text-sm dark:bg-gray-600"
          >
            <span>
              {primary
                ? `${t.detailedAnalysisOfDiagnosis}: ${primary.diagnosis}`
                : t.detailedAnalysis}
            </span>
            {detailsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {detailsOpen && (hasBackendDetails ? (
            <div className="mt-2 space-y-2 rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-600">
              {detailsSections!.map((sec) => (
                <div key={sec.title}>
                  <p className="font-medium">{sec.title}:</p>
                  <ul className="list-inside list-disc text-gray-600 dark:text-gray-400">
                    {sec.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 rounded-lg border border-gray-200 p-3 text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
              {t.detailedAnalysisUnavailable}
            </p>
          ))}
          <p className="mt-3 text-sm italic text-gray-600 dark:text-gray-400">
            {t.closingMessage}
          </p>
        </div>
        
      </div>
    </div>
  );
};
