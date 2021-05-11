import * as React from "react";
import { useEffect } from "react";
import { useRecoilSnapshot } from "recoil";
import { environment } from "../../../../../environments/environment";

/**
 * Observing all state changes in Recoil.
 *
 * @see
 * https://recoiljs.org/docs/guides/dev-tools#observing-all-state-changes
 */
function LogRecoilStateChanges() {
  const snapshot = useRecoilSnapshot();

  useEffect(() => {
    const modifiedAtomsIter = snapshot.getNodes_UNSTABLE({ isModified: true });
    // @ts-ignore
    const modifiedAtoms = [...modifiedAtomsIter];

    if (!modifiedAtoms.length) {
      return;
    }

    for (const atom of modifiedAtoms) {
      const snapshotAtom = snapshot.getLoadable(atom);

      // eslint-disable-next-line no-console
      console.debug(`Recoil atom modified: ${atom.key}`, snapshotAtom.getValue());
    }
  }, [snapshot]);

  return null;
}

function RecoilDebugObserver() {
  const logStateChanges = environment.DEBUG_RECOIL;

  return logStateChanges ? <LogRecoilStateChanges /> : null;
}

export default RecoilDebugObserver;
