import { Paragraph, themeColor, ViewerContainer } from '@amsterdam/asc-ui';
import Button from 'components/Button';
import Map from 'components/Map';
import L from 'leaflet';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import MAP_OPTIONS from 'shared/services/configuration/map-options';
import { unknown } from 'signals/incident/definitions/wizard-step-2-vulaan/afval-icons';
import styled from 'styled-components';
import ContainerSelectContext from '../context';
import type { Item, ClickEvent, FeatureType } from '../types';
import type { MapOptions, LatLng, Map as MapType } from 'leaflet';

import WfsLayer from './WfsLayer';
import { wgs84ToRd } from 'shared/services/crs-converter/crs-converter';
import type { WfsLayerProps } from './types';
import {
  MapPanel,
  MapPanelContext,
  MapPanelDrawer,
  MapPanelLegendButton,
  MapPanelProvider,
} from '@amsterdam/arm-core';
import { Overlay, SnapPoint } from '@amsterdam/arm-core/lib/components/MapPanel/constants';
import { useMatchMedia } from '@amsterdam/asc-ui/lib/utils/hooks';
import LegendPanel from '../LegendPanel/LegendPanel';

const ButtonBar = styled.div`
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  z-index: 401;
`;

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

const StyledMap = styled(Map)`
  height: 100%;
  width: 100%;

  .marker-cluster {
    color: ${themeColor('tint', 'level1')};
    background-color: ${themeColor('tint', 'level1')};
    box-shadow: 1px 1px 1px #666666;

    div {
      width: 32px;
      height: 32px;
      margin-top: 4px;
      margin-left: 4px;
      background-color: ${themeColor('primary')};
    }

    span {
      line-height: 34px;
    }
  }
`;

const StyledViewerContainer = styled(ViewerContainer)<{ leftOffset: string; height: string }>`
  left: ${({ leftOffset }) => leftOffset};
  /* height: ${({ height }) => height}; */
  transition: height 0.3s ease-in-out;
`;

const ViewerContainerWithMapDrawerOffset: React.FC = props => {
  const { drawerPosition } = useContext(MapPanelContext);
  const height = Number.parseInt(drawerPosition, 10) < window.innerHeight / 2 ? '50%' : drawerPosition;

  return <StyledViewerContainer {...props} height={height} leftOffset={drawerPosition} />;
};

const LegendButtonWrapper = styled.div`
  z-index: 400;
`;

const unknownFeatureType: FeatureType = {
  description: 'De container staat niet op de kaart',
  label: 'Onbekend',
  icon: {
    iconSvg: unknown,
  },
  idField: 'id',
  typeField: 'type',
  typeValue: 'not-on-map',
};

// Temporary selction. Will be removes when selectionfunctionality will be implemented.
const SELECTED_ITEMS = [
  { id: 'PL734', type: 'Plastic' },
  { id: 'GLA00137', type: 'Glas' },
  { id: 'BR0234', type: 'Brood' },
  { id: 'PP0234', type: 'Papier' },
  { id: 'TEX0234', type: 'Textiel' },
  { id: 'GFT0234', type: 'GFT' },
  { id: 'RES0234', type: 'Rest' },
  { id: 'NOP0234', type: 'not-on-map' },
];

const Selector = () => {
  // to be replaced with MOUNT_NODE
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const appHtmlElement = document.getElementById('app')!;

  const { selection, location, meta, update, close } = useContext(ContainerSelectContext);
  const featureTypes = useMemo(() => (meta && [...meta.featureTypes, unknownFeatureType]) || [], [meta]);
  const [showDesktopVariant] = useMatchMedia({ minBreakpoint: 'tabletM' });
  const panelVariant = showDesktopVariant ? 'drawer' : 'panel';

  const Panel = showDesktopVariant ? MapPanel : MapPanelDrawer;

  const mapOptions = useMemo<MapOptions>(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    () => ({
      ...MAP_OPTIONS,
      center: location?.reverse(),
      zoomControl: false,
      minZoom: 10,
      maxZoom: 15,
      zoom: 14,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [currentOverlay, setCurrentOverlay] = useState<Overlay>(Overlay.None);
  const [, setMap] = useState();

  const addContainer = useCallback<ClickEvent>(
    event => {
      event.preventDefault();

      // We use here a fixed list for now
      const selectedItems: Item[] = SELECTED_ITEMS.map(({ id, type }) => {
        const found: Partial<FeatureType> = featureTypes.find(({ typeValue }) => typeValue === type) ?? {};
        const { description, icon } = found;

        return {
          id,
          type,
          description,
          iconUrl: icon ? `data:image/svg+xml;base64,${btoa(icon.iconSvg)}` : '',
        };
      });

      update(selectedItems);
    },
    [update, featureTypes]
  );

  const removeContainer = useCallback<ClickEvent>(
    event => {
      event.preventDefault();
      update(null);
    },
    [update]
  );

  const getFeatureType = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    feature => meta?.featureTypes.find(({ typeField, typeValue }) => feature.properties[typeField] === typeValue),
    [meta]
  );

  const wfsLayerProps: WfsLayerProps = {
    url: meta?.endpoint ?? '',
    options: {
      getMarker: (feature: any, latlng: LatLng) => {
        const featureType = getFeatureType(feature);
        if (!featureType) return L.marker({ ...latlng, lat: 0, lng: 0 });

        return L.marker(latlng, {
          icon: L.icon({
            ...featureType.icon.options,
            className: featureType.label,
            iconUrl: `data:image/svg+xml;base64,${btoa(featureType.icon.iconSvg)}`,
          }),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          alt: feature.properties[featureType.idField] as string,
        });
      },
      getBBox: (mapInstance: MapType): string => {
        const bounds = mapInstance.getBounds();
        const southWestRd = wgs84ToRd(bounds.getSouthWest());
        const northEastRd = wgs84ToRd(bounds.getNorthEast());

        const bbox = `${southWestRd.x},${southWestRd.y},${northEastRd.x},${northEastRd.y}`;

        return `&${L.Util.getParamString({
          bbox,
        }).substring(1)}`;
      },
    },
    zoomLevel: { max: 7 },
  };

  return ReactDOM.createPortal(
    <Wrapper>
      <StyledMap data-testid="map" hasZoomControls mapOptions={mapOptions} setInstance={setMap} events={{}}>
        <MapPanelProvider
          mapPanelSnapPositions={{
            [SnapPoint.Closed]: '90%',
            [SnapPoint.Halfway]: '50%',
            [SnapPoint.Full]: '0px',
          }}
          mapPanelDrawerSnapPositions={{
            [SnapPoint.Closed]: '30px',
            [SnapPoint.Halfway]: '50%',
            [SnapPoint.Full]: '100%',
          }}
          variant={panelVariant}
          initialPosition={SnapPoint.Closed}
        >
          <ViewerContainerWithMapDrawerOffset
            bottomLeft={
              <LegendButtonWrapper>
                <MapPanelLegendButton
                  showDesktopVariant={showDesktopVariant}
                  currentOverlay={currentOverlay}
                  setCurrentOverlay={setCurrentOverlay}
                />
              </LegendButtonWrapper>
            }
            topRight={
              <ButtonBar>
                <div>
                  <Button onClick={addContainer}>Container toevoegen</Button>
                  <Button onClick={removeContainer}>Container verwijderen</Button>
                  <Button onClick={close}>Meld deze container/Sluiten</Button>
                </div>
                <Paragraph as="h6">
                  Geselecteerd: {selection ? `[${selection.reduce((res, { id }) => `${res},${id}`, '')}]` : '<geen>'}
                </Paragraph>
              </ButtonBar>
            }
          />
          <Panel>
            {meta && (
              <LegendPanel
                variant={panelVariant}
                title="Legenda"
                items={meta.featureTypes.map(featureType => ({
                  label: featureType.label,
                  iconUrl: `data:image/svg+xml;base64,${btoa(featureType.icon.iconSvg)}`,
                  id: featureType.typeValue,
                }))}
              />
            )}
          </Panel>
        </MapPanelProvider>
        <WfsLayer {...wfsLayerProps}></WfsLayer>
      </StyledMap>
    </Wrapper>,
    appHtmlElement
  );
};

export default Selector;
