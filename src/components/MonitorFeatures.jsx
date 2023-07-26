import React, { useState } from "react"
import { useObject } from "../hooks/useObject"
import Slider from "./Slider"
const ignoreCodes = ["0x10", "0x12", "0x13", "0x62", "0xD6"]

export default function MonitorFeatures(props) {
    const { monitor, name, monitorFeatures, T, onChange } = props

    let extraHTML = []

    if(monitor.type === "ddcci" && monitor?.features && Object.keys(monitor.features).length > 0) {

        // Contrast
        if (monitor.features["0x12"]) {
            const vcp = "0x12"
            const settings = window.settings?.monitorFeaturesSettings?.[monitor?.hwid[1]]?.[vcp]
            const enabled = monitorFeatures?.["0x12"];
            extraHTML.push(
                <div className="feature-toggle-set" key={vcp} data-active={enabled}>
                    <div className="feature-toggle-row" key="contrast">
                        <input onChange={() => {props?.toggleFeature(monitor.hwid[1], "0x12")}} checked={(enabled ? true : false)} data-checked={(enabled ? true : false)} type="checkbox" />
                        <div className="feature-toggle-label"><span className="icon vfix">&#xE793;</span><span>{T.t("PANEL_LABEL_CONTRAST")}</span></div>
                    </div>
                    <MonitorFeaturesSettings onChange={onChange} key={vcp + "_settings"} enabled={enabled} settings={settings} hwid={monitor?.hwid?.[1]} vcp={vcp} /> 
                </div>
            )
        }
    
        // Volume
        if (monitor.features["0x62"]) {
            const vcp = "0x62"
            const settings = window.settings?.monitorFeaturesSettings?.[monitor?.hwid[1]]?.[vcp]
            const enabled = monitorFeatures?.["0x62"];
            extraHTML.push(
                <div className="feature-toggle-set" key={vcp} data-active={enabled}>
                    <div className="feature-toggle-row" key="volume">
                        <input onChange={() => {props?.toggleFeature(monitor.hwid[1], "0x62")}} checked={(enabled ? true : false)} data-checked={(enabled ? true : false)} type="checkbox" />
                        <div className="feature-toggle-label"><span className="icon vfix">&#xE767;</span><span>{T.t("PANEL_LABEL_VOLUME")}</span></div>
                    </div>
                    <MonitorFeaturesSettings onChange={onChange} key={vcp + "_settings"} enabled={enabled} settings={settings} hwid={monitor?.hwid?.[1]} vcp={vcp} /> 
                </div>
            )
        }
    
        // Power State
        if (monitor.features["0xD6"]) {
            const vcp = "0xD6"
            const enabled = monitorFeatures?.["0xD6"];
            extraHTML.push(
                <div className="feature-toggle-row" key="powerState">
                    <input onChange={() => {props?.toggleFeature(monitor.hwid[1], "0xD6")}} checked={(enabled ? true : false)} data-checked={(enabled ? true : false)} type="checkbox" />
                    <div className="feature-toggle-label"><span className="icon vfix">&#xE7E8;</span><span>{T.t("PANEL_LABEL_OFF_ON")} ⚠️</span></div>
                </div>
            )
        }

        for(const vcp in monitorFeatures) {
            if(ignoreCodes.indexOf(vcp) === -1 && monitorFeatures[vcp]) {
                const settings = window.settings?.monitorFeaturesSettings?.[monitor?.hwid[1]]?.[vcp]
                const enabled = monitorFeatures?.[vcp];
                extraHTML.push(
                    <div className="feature-toggle-set" key={vcp} data-active={enabled}>
                        <div className="feature-toggle-row" key={vcp}>
                            <span className="icon vfix" style={{cursor: "pointer"}} onClick={() => {props?.toggleFeature(monitor.hwid[1], vcp)}}>&#xe74d;</span>
                            <div className="feature-toggle-label"><span>Custom ({vcp})</span></div>
                        </div>
                        <MonitorFeaturesSettings onChange={onChange} enabled={enabled} settings={settings} hwid={monitor?.hwid?.[1]} vcp={vcp} /> 
                    </div>
                )
            }
        }

    } else {
        extraHTML.push(<p key="none">{T.t("SETTINGS_FEATURES_UNSUPPORTED")}</p>)
    }

    return (
        <div key={monitor.key}>
            <br />
            <div className="sectionSubtitle"><div className="icon">&#xE7F4;</div><div>{monitor.name}</div></div>
            <div className="feature-toggle-list">{extraHTML}</div>
            <br />
        </div>
    )
}

function MonitorFeaturesSettings(props) {
    const { enabled, settings, hwid, vcp, onChange } = props 
    if(!enabled) return (<></>);

    const [settingsObj, updateSettings] = useObject(Object.assign({
        icon: "e897",
        iconType: "windows",
        iconText: "",
        iconPath: "",
        min: 0,
        max: 100,
        maxVisual: 100,
        linked: false
      }, settings))

      const onChangeHandler = (settingName, value) => {
        try {
            updateSettings({[settingName]: value})
            window.settings.monitorFeaturesSettings[hwid][vcp][settingName] = value
            if(onChange) onChange(settingName, value);
        } catch(e) {
            console.log(e)
        }
      }

      const iconType = (
        <select value={settingsObj.iconType} onChange={e => onChangeHandler("iconType", e.target.value)}>
            <option value="windows">Icon</option>
            <option value="text">Text</option>
        </select>
      )

      const icon = (
        <select style={{fontFamily: `"Segoe Fluent Icons", "Segoe MDL2 Assets"`}} onChange={e => onChangeHandler("icon", e.target.value)}>
            <WindowsIconsOptions />
        </select>
      )

      const iconText = (
        <input value={settingsObj.iconText} onChange={e => onChangeHandler("iconText", e.target.value)} />
      )

    return(
        <div className="feature-toggle-settings">
            { ignoreCodes.indexOf(vcp) === -1 ? iconType : null }
            { ignoreCodes.indexOf(vcp) === -1 && settingsObj.iconType === "windows" ? icon : null }
            { ignoreCodes.indexOf(vcp) === -1 && settingsObj.iconType === "text" ? iconText : null }
            <br />
            <Slider min={0} max={100} name={"Min"} onChange={value => onChangeHandler("min", value)} level={settingsObj.min} scrolling={false} />
            <Slider min={0} max={100} name={"Max"} onChange={value => onChangeHandler("max", value)} level={settingsObj.max} scrolling={false} />
            <div className="feature-toggle-row">
                <input onChange={e => onChangeHandler("linked", e.target.checked)} checked={(settingsObj.linked ? true : false)} data-checked={(settingsObj.linked ? true : false)} type="checkbox" />
                <div className="feature-toggle-label"><span>Linked to brightness</span></div>
            </div>
        </div>
    )
}

const windowsIcons = [
    "e897",
    "e706",
    "e70c",
    "e71d",
    "e727",
    "e733",
    "e734",
    "e73a",
    "e772",
    "e767",
    "e760",
    "e761",
    "e781",
    "e783",
    "e793",
    "e794",
    "e7a1",
    "e7b3",
    "e7e8",
    "e7f4",
    "e7f7",
    "e82f",
    "e836",
    "ea61",
    "ea80",
    "eb67",
    "ebaa",
    "edb1",
    "edb5",
    "f08c",
    "f093",
    "f094",
    "f095",
    "f096",
    "f0ce",
    "f1db",
    "f1e8",
    "f4a5",
    "f736",
    "f78b",
    "f785",
    "f78d",
    "f0b2",
    "e8be",
    "e88e",
    "e839",
    "e7fc",
    "e78b",
    "e713",
    "eb9f",
    "ed39",
    "ed3a"
]

function WindowsIconsOptions(props) {
    return windowsIcons.map(icon => {
        return (<option style={{fontFamily: `"Segoe Fluent Icons", "Segoe MDL2 Assets"`, fontSize: "18px"}} key={icon} value={icon} dangerouslySetInnerHTML={{__html: `&#x${icon}; (${icon})` }}></option>)
    })
}